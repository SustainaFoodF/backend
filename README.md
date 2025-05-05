SustainaFood – Backend
🌿 Présentation
Le backend de SustainaFood est une API RESTful développée avec Node.js et Express.js. Il gère les fonctionnalités essentielles de l'application, telles que :

Gestion des produits alimentaires

Analyse des ingrédients via des images

Informations nutritionnelles

Gestion du panier d'achat

Authentification des utilisateurs

Intégration avec des services externes (par exemple, API nutritionnelles)

📁 Structure du projet 
backend/
├── controllers/       # Logique métier pour chaque route
├── models/            # Modèles de données (MongoDB/Mongoose)
├── routes/            # Définition des routes de l'API
├── services/          # Intégration avec des services externes
├── uploads/           # Stockage des images téléchargées
├── utils/             # Fonctions utilitaires
├── .env               # Variables d'environnement
├── app.js             # Point d'entrée principal de l'application
├── package.json       # Dépendances et scripts
git clone https://github.com/SustainaFoodF/backend.git
cd backend
Installer les dépendances

bash
Copier
Modifier
npm install
Configurer les variables d'environnement

Créez un fichier .env à la racine du projet avec les variables suivantes :

env
Copier
Modifier
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sustainafood
API_KEY=your_api_key_here
Lancer le serveur

bash
Copier
Modifier
npm start
Le serveur sera accessible à l'adresse http://localhost:5001.

🧪 API Endpoints
🔍 Analyse des ingrédients
POST /product/recipes

Description : Analyse les images téléchargées pour détecter les ingrédients.

Corps de la requête : multipart/form-data avec des fichiers image.

Réponse :

json
Copier
Modifier
{
  "detectedIngredients": ["tomate", "poulet", "riz"]
}
🛒 Gestion du panier
POST /cart/add

GET /cart

DELETE /cart/remove/:productId

📊 Informations nutritionnelles
GET /nutrition/:ingredient

Réponse :

json
Copier
Modifier
{
  "calories": 120,
  "proteins": 8,
  "fats": 5,
  "carbs": 10
}
🔐 Authentification
POST /auth/register

POST /auth/login

GET /auth/profile

🧪 Tests
Les tests sont écrits à l'aide de Jest. Pour exécuter les tests :

bash
Copier
Modifier
npm test
📦 Dépendances principales
express

mongoose

multer – pour la gestion des fichiers

axios – pour les appels aux API externes

jsonwebtoken – pour l'authentification

dotenv – pour la gestion des variables d'environnement

📄 Licence
Ce projet est sous licence MIT.
