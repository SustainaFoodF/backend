const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse email
    pass: process.env.EMAIL_PASS, // Votre mot de passe ou mot de passe d'application
  },
});
//fonction te5ou 3 parametres
module.exports.sendConfirmationEmail = async (name, email, activationCode) => {
  if (!name || !email || !activationCode) {
    console.error("Paramètres manquants pour l'envoi de l'email :");
    throw new Error("Paramètres manquants pour l'envoi de l'email");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Veuillez activer votre compte",
    html: `
      <div>
        <h1>Activation du compte</h1>
        <h2>Bonjour ${name}</h2>
        <p>Veuillez confirmer votre email en cliquant sur le lien suivant :</p>
        <a href="http://localhost:3000/confirm/${activationCode}">Cliquez ici</a>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de confirmation envoyé avec succès à :", email);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email de confirmation :", err);
    throw new Error("Échec de l'envoi de l'email de confirmation");
  }
};

module.exports.sendResetPasswordEmail = async (email, resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Demande de réinitialisation du mot de passe",
    html: `
        <div>
          <h1>Réinitialisation du mot de passe</h1>
          <p>Réinitialisez votre mot de passe en cliquant sur le lien suivant :</p>
          <a href="http://localhost:3000/resetpassword/${resetToken}">Cliquez ici</a>
        </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé avec succès à :", email);
  } catch (err) {
    console.error(
      "Erreur lors de l'envoi de l'email de réinitialisation :",
      err.message
    ); // Affichez l'erreur
    throw new Error("Échec de l'envoi de l'email de réinitialisation");
  }
};



module.exports.sendWinElectionEMail = (email) => {
  // transport houwa jesr from chkoun to amal  html body message chnouwa f wostou
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Résultat élection",
      html: `
      <div>
      <h1> Vous avez ganger dans cette élection et vous serez syndic </h1>
      
        <p>ous avez ganger dans cette élection et vous serez syndic
</p>
      
        </div>`,
    })
    .catch((err) => console.log(err));
};
