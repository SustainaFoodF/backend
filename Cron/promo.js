const cron = require("node-cron");
const Product = require("../Models/Product");
const User = require("../Models/User");
const { sendPromoEmail } = require("../config/nodemailer.config");

const applyPromoIfExpiring = async () => {
  try {
    const today = new Date();
    const products = await Product.find();

    const productsExpiringSoon = products.filter((product) => {
      const expirationDate = new Date(product.dateExp);
      const timeDifference = expirationDate - today;
      const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      return daysLeft === 5; // Produits expirant dans 5 jours
    });

    console.log(
      `🔍 ${productsExpiringSoon.length} produit(s) expirent dans 5 jours.`
    );

    // Appliquer la promo
    for (let product of productsExpiringSoon) {
      const oldPrice = product.prix; // Enregistre le prix actuel
      const newPrice = parseFloat((oldPrice * 0.8).toFixed(2)); // Réduction de 20%

      if (!product.isPromo) {
        product.oldPrice = oldPrice; // Enregistre l'ancien prix
        product.prix = newPrice; // Met à jour le prix réduit
        product.isPromo = true; // Marque le produit comme étant en promo
        await product.save(); // Sauvegarde dans la base de données
        console.log(
          `💸 Promo appliquée à "${product.label}" : Ancien prix = ${oldPrice}, Nouveau prix = ${newPrice}`
        );
      }
    }

    // Envoyer des emails aux clients
    const clients = await User.find({ role: "client" });

    let totalEmailsSent = 0;

    for (let client of clients) {
      let updated = false;

      for (let product of productsExpiringSoon) {
        const alreadySent = client.promotionsSent?.some(
          (promo) => promo.productId.toString() === product._id.toString()
        );

        if (!alreadySent) {
          console.log(
            `📧 Envoi d’un email à ${client.email} pour "${product.label}"`
          );
          await sendPromoEmail(client.email, product);

          client.promotionsSent = client.promotionsSent || [];
          client.promotionsSent.push({
            productId: product._id,
            dateSent: new Date(),
          });
          updated = true;
          totalEmailsSent++;
        } else {
          console.log(
            `❌ Email déjà envoyé à ${client.email} pour "${product.label}"`
          );
        }
      }

      if (updated) {
        await client.save();
        console.log(`💾 Données client ${client.email} mises à jour.`);
      }
    }

    console.log(`✅ ${productsExpiringSoon.length} produit(s) mis en promo.`);
    console.log(`📨 ${totalEmailsSent} email(s) envoyés au total.`);
  } catch (error) {
    console.error("❌ Erreur promo automatique :", error.message);
  }
};

// Cron job toutes les 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("⏱️ Cron toutes les 5 minutes !");
  applyPromoIfExpiring();
});

module.exports = { applyPromoIfExpiring };