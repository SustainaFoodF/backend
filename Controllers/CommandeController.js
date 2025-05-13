const CommandModel = require("../Models/Command");
const User = require("../Models/User"); //
const Task = require("../Models/Task"); 
const Notification = require("../Models/Notification");
const { updateProductQuantity } = require("../Services/productService");
const { sendOrderConfirmationEmail } = require("../Services/emailService");

exports.createCommand = async (req, res) => {
  try {
    const owner = req.user._id;
    const { cart, dateLivraison, location, phoneNumber } = req.body;
    let products = [];
    for (let item of cart) {
      products.push({
        product: item.product,
        quantity: item.quantity,
        priceOfProduct: item.product.prix * item.quantity,
      });
      await updateProductQuantity(item.product, item.quantity);
    }
    let totalPrice = 0;

    for (let p of products) {
      totalPrice = totalPrice + p.priceOfProduct;
    }
    const command = new CommandModel({
      owner,
      products,
      totalPrice,
      dateLivraison,
      location,
      phoneNumber,
    });
    await command.save();

    // 💌 ENVOI EMAIL AU CLIENT
    const user = await User.findById(owner);
    if (user && user.email) {
      const orderDetails = {
        items: products.map(p => ({
          name: p.product.label,
          quantity: p.quantity,
          price: p.product.prix * p.quantity,
        })),
        total: totalPrice.toFixed(2),
      };
    
      await sendOrderConfirmationEmail(user.email, orderDetails);
    }
    

    res.status(201).json(command);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create command", message: err.message });
  }
};

exports.assignDeliverer = async (req, res) => {
  try {
    const { commandId, delivererId } = req.body;
    
    // 1. Update the command
    const command = await CommandModel.findByIdAndUpdate(
      commandId,
      { livreur: delivererId },
      { new: true }
    ).populate('owner products.product');

    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }

    // 2. Create corresponding task
    const taskData = {
      pickup: {
        businessName: command.products[0]?.product?.owner?.name || "Our Store",
        address: command.location,
        contactPerson: "Store Manager",
        contactPhone: command.phoneNumber,
        pickupTime: new Date()
      },
      dropoff: {
        clientName: command.owner.name,
        address: command.owner.addresses[0]?.street || "Unknown",
        contactPhone: command.phoneNumber,
        deliveryInstructions: command.owner.addresses[0]?.deliveryNotes || ""
      },
      details: {
        orderItems: command.products.map(p => ({
          name: p.product.label,
          quantity: p.quantity
        })),
        totalValue: command.totalPrice,
        paymentMethod: command.isPaid ? "Prepaid" : "Cash on Delivery"
      },
      assignedTo: delivererId,
      createdBy: req.user._id,
      estimatedDeliveryTime: command.dateLivraison,
      distance: 5 // TODO: Calculate actual distance
    };

    const task = await Task.create(taskData);

    // 3. Create notification
    await Notification.create({
      recipient: delivererId,
      type: 'Task Assignment',
      title: 'New Delivery Task',
      message: `You've been assigned to deliver order #${command._id.toString().slice(-6)}`,
      relatedTask: task._id
    });

    res.status(200).json({
      message: "Deliverer assigned and task created",
      command,
      task
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ 
      error: "Assignment failed",
      message: err.message 
    });
  }
};

exports.updateCommandPayment = async (req, res) => {
  try {
    const id = req.params.id;
    const command = await CommandModel.findById(id);
    command.isPaidVerified = true;
    await command.save();
    res.status(201).json(command);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to create command", message: err.message });
  }
};
exports.getAll = async (req, res) => {
  const commands = await CommandModel.find().populate({
    path: "products.product",
    populate: {
      path: "owner", // This is the owner inside the Product model
      model: "users", // Ensure "users" is the correct model name
    },
  });

  res.status(200).json(commands);
};
exports.getCommandsByUser = async (req, res) => {
  const user = req.user;
  try {
    if (user.role === "client") {
      // Client logic (unchanged, works fine)
      const commands = await CommandModel.find({ owner: user._id }).populate({
        path: "products.product",
        populate: {
          path: "owner",
          model: "users",
        },
      });
      return res.status(200).json(commands);
      
    } else if (user.role === "business") {
      // Improved business logic
      const allCommands = await CommandModel.find()
        .populate({
          path: "products.product",
          populate: {
            path: "owner",
            model: "users",
            select: "_id" // Only get the _id for owner to reduce data
          }
        })
        .populate("owner", "name");

      // Safely filter commands that have at least one product owned by the business
      const filteredCommands = allCommands
        .map(command => command.toObject()) // Convert to plain objects
        .filter(command => 
          command.products.some(product => 
            product?.product?.owner?._id?.toString() === user._id.toString()
          )
        )
        .map(command => ({
          ...command,
          products: command.products.filter(product => 
            product?.product?.owner?._id?.toString() === user._id.toString()
          )
        }));

      return res.status(200).json(filteredCommands);
      
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.error("Error fetching commands:", error);
    return res.status(500).json({ 
      message: "Server error",
      error: error.message,
      stack: error.stack // Include stack trace for debugging
    });
  }
};