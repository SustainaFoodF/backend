const nodemailer = require("nodemailer");

// Transporteur sécurisé
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "salmabenyohmes9@gmail.com", // ton email Gmail
    pass: "lras mptq ygvs xksg", // mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false // Désactiver la vérification du certificat SSL
  }

});

// Fonction pour envoyer un email de confirmation de commande
exports.sendOrderConfirmationEmail = async (to, orderDetails) => {
  const mailOptions = {
    from: '"SustainaFood 🌿" <salmabenyohmes9@gmail.com>',
    to,
    subject: "Confirmation de votre commande - SustainaFood 🌿",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f9f6; color: #333;">
        <h2 style="color: #4CAF50;">Merci pour votre commande chez SustainaFood 🌱</h2>
        <p>Bonjour cher(e) client(e),</p>
        <p>Nous avons bien reçu votre commande. Voici les détails :</p>

        <div style="background: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h4>Résumé de votre commande :</h4>
          <ul style="list-style: none; padding: 0;">
            ${orderDetails.items.map(item => `
              <li style="margin-bottom: 10px;">
                <strong>${item.name}</strong> - Quantité : ${item.quantity} - Prix : ${item.price} TND
              </li>
            `).join('')}
          </ul>
          <p><strong>Total : ${orderDetails.total} TND</strong></p>
        </div>

        <p style="margin-top: 20px;">Nous espérons que vous apprécierez vos produits frais et sains 🌾.</p>

        <p>À très bientôt sur SustainaFood !</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">Ceci est un message automatique. Merci de ne pas y répondre.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
