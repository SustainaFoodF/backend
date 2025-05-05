const cron = require("node-cron");
const Product = require("../Models/Product");
const User = require("../Models/User");
const { sendPromoEmail } = require("../config/nodemailer.config");

const applyPromoIfExpiring = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparaison précise
    const products = await Product.find();

    // Trouver les produits expirant dans exactement 5 jours
    const productsExpiringSoon = products.filter((product) => {
      const expirationDate = new Date(product.dateExp);
      expirationDate.setHours(0, 0, 0, 0);
      const timeDifference = expirationDate - today;
      const daysLeft = timeDifference / (1000 * 60 * 60 * 24);
      return daysLeft === 5;
    });

    console.log(
      `🔍 ${productsExpiringSoon.length} produit(s) expirent dans 5 jours.`
    );

    // Appliquer la promotion aux produits
    for (let product of productsExpiringSoon) {
      if (!product.isPromo) {
        const originalPrice = product.prix; // Prix original
        const reducedPrice = parseFloat((originalPrice * 0.8).toFixed(2)); // Réduction de 20%

        product.nouveauPrix = reducedPrice; // Stocker le nouveau prix
        product.isPromo = true; // Marque le produit comme étant en promotion

        await product.save(); // Sauvegarde dans la base de données
        console.log(
          `💸 Promo appliquée à "${product.label}" : Prix original = ${originalPrice}, Nouveau prix = ${reducedPrice}`
        );
      }
    }

    // Trouver les clients
    const clients = await User.find({ role: "client" });

    let totalEmailsSent = 0;

    // Envoyer des emails de promotion
    for (let client of clients) {
      let updated = false;

      for (let product of productsExpiringSoon) {
        // Vérifier si un email a déjà été envoyé pour ce produit
        const alreadySent = client.promotionsSent?.some(
          (promo) => promo.productId.toString() === product._id.toString()
        );

        if (!alreadySent) {
          console.log(
            `📧 Envoi d’un email à ${client.email} pour "${product.label}"`
          );
          await sendPromoEmail(client.email, product); // Envoyer l'email

          // Ajouter le produit à la liste des promotions envoyées
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

      // Sauvegarder les modifications dans les données du client
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