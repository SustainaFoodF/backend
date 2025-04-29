const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51RAuHU2LYJb902nChOjymDGQpmCBwHnLNMVDiDjQ5tlXyowm7aQfv0TbFYcLJ7TnRdcst14LrkcHdrMbYdXrnBT700EJTFAETT"
); // Replace with your secret key
const CommandModel = require("../Models/Command");

module.exports.createIntent = async (req, res) => {
  try {
    const { commandId } = req.body;
    const command = await CommandModel.findById(commandId);
    if (!command) {
      res.status(404).json({ error: "Command not found ! " });
    }
    const amount = Math.round(command.totalPrice * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents (e.g., 2000 = $20)
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    command.isPaid = true;
    await command.save();

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
