const CommandModel = require("../Models/Command");
const { updateProductQuantity } = require("../Services/productService");
const UserModel = require("../Models/User");
 
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
    res.status(201).json(command);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to create command", message: err.message });
  }
};
exports.assignDeliverer = async (req, res) => {
  try {
    const { commandId, delivererId } = req.body;
 
    // Vérifier que la commande existe
    const command = await CommandModel.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
 
    // Vérifier que le livreur existe
    const deliverer = await UserModel.findById(delivererId);
    if (!deliverer || deliverer.role !== "livreur") {
      return res.status(404).json({ message: "Livreur non trouvé" });
    }
 
    // Affecter le livreur à la commande
    command.livreur = delivererId;
    await command.save();
 
    res.status(200).json({ message: "Livreur affecté avec succès", command });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erreur lors de l'affectation du livreur", message: err.message });
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
  const user = req.user; // assuming the user is attached to the request object
  try {
    if (user.role === "client") {
      // Get all commands for the client (based on `owner`)
      const commands = await CommandModel.find({ owner: user._id }).populate({
        path: "products.product",
        populate: {
          path: "owner", // Get owner details for each product
          model: "users",
        },
      });
 
      return res.status(200).json(commands);
    } else if (user.role === "business") {
      // For business role, we filter out only the products owned by the business
      const commands = await CommandModel.find()
        .populate({
          path: "products.product",
          populate: {
            path: "owner",
            model: "users",
          },
        })
        .populate("owner", "name");
      /*commands = commands.filter((e) =>
        e.products.some((p) => p.owner._id.toString() === user._id)
      );*/
      const filtered = commands
        .filter((command) =>
          command.products.some(
            (product) =>
              product.product.owner._id.toString() === user._id.toString()
          )
        )
        .map((command) => ({
          ...command.toObject(), // Convert Mongoose document to plain object
          products: command.products.filter(
            (product) =>
              product.product.owner._id.toString() === user._id.toString()
          ),
        }));
 
      // You may want to filter out commands where no products belong to the business
 
      return res.status(200).json(filtered);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.error("Error fetching commands:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
 