const cron = require("node-cron");
const ProductModel = require("../Models/Product"); // Vérifiez le chemin

// Tâche planifiée pour supprimer les produits expirés chaque jour à minuit
// Tâche planifiée pour supprimer les produits expirés toutes les minutes (pour tester)
const deleteExpiredProductsCron = () => {
  cron.schedule("* * * * *", async () => { // Changez "0 0 * * *" en "* * * * *"
    try {
      const today = new Date();
      const result = await ProductModel.deleteMany({ dateExp: { $lte: today } });
      console.log(`${result.deletedCount} produits expirés supprimés.`);
    } catch (error) {
      console.error("Erreur lors de la suppression des produits expirés :", error);
    }
  });
};

module.exports = deleteExpiredProductsCron;