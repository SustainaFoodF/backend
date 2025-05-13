const UserModel = require("../Models/User");
const { transporter } = require("../config/nodemailer.config");

const sendEmail = async (title, description, email) => {
  if (!title || !email) {
    throw new Error("Paramètres manquants pour l'envoi de l'email");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: title,
    html: `<div>${description}</div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de notification envoyé avec succès à :", email);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email :", err);
    throw new Error("Échec de l'envoi de l'email");
  }
};

module.exports.sendNotificationToUser = async (
  title,
  description,
  groupValue,
  groupAttribute
) => {
  try {
    const users = await UserModel.find({ [groupAttribute]: groupValue });

    if (users.length === 0) {
      console.log("Aucun utilisateur trouvé pour l'attribut :", groupAttribute);
      return;
    }

    const emailPromises = users.map((user) =>
      sendEmail(title, description, user.email)
    );

    await Promise.all(emailPromises);
    console.log("Tous les emails ont été envoyés.");
  } catch (err) {
    console.error("Erreur lors de l'envoi des notifications :", err);
  }
};
