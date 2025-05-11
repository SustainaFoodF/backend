

# SustainaFood – Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![VS Code](https://img.shields.io/badge/VS--Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-000000?style=for-the-badge&logo=github&logoColor=white)
![axios](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Build](https://img.shields.io/github/actions/workflow/status/SustainaFoodF/backend/ci.yml?branch=main&style=for-the-badge)
## 🔐 Variables d’environnement

Voici les principaux services utilisés dans le fichier `.env` :

![PORT](https://img.shields.io/badge/Port-5001-blue?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Secret-black?style=for-the-badge&logo=jsonwebtokens)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-Auth-red?style=for-the-badge&logo=gmail&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google-OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Spoonacular API](https://img.shields.io/badge/Spoonacular-API-green?style=for-the-badge)
![Clarifai](https://img.shields.io/badge/Clarifai-Image_API-blueviolet?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Gemini-AI_API-4285F4?style=for-the-badge&logo=google)


🌿 **Présentation**  
Le backend de SustainaFood est une API RESTful développée avec Node.js et Express.js. Il gère les fonctionnalités essentielles de l'application, telles que :
...







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
