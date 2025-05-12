

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
## 🔐Environment variables

Here are the main services used in the `.env` file:

![PORT](https://img.shields.io/badge/Port-5001-blue?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Secret-black?style=for-the-badge&logo=jsonwebtokens)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-Auth-red?style=for-the-badge&logo=gmail&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google-OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Spoonacular API](https://img.shields.io/badge/Spoonacular-API-green?style=for-the-badge)
![Clarifai](https://img.shields.io/badge/Clarifai-Image_API-blueviolet?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Gemini-AI_API-4285F4?style=for-the-badge&logo=google)



SustainaFood – Backend
🌿PresentationThe
backend of SustainaFood is a RESTful API developed with Node.js and Express.js. It manages the essential functionalities of the application, such as:- Management of food products- Analysis of ingredients through images- Nutritional information- Shopping cart management- User authentication- Integration with external services (e.g., nutritional APIs)




📁Project structure


backend/
├── controllers/      # Business logic for each route
├── models/            #  Data models  (MongoDB/Mongoose)
├── routes/            # Definition of the API routes
├── services/          #Integration with external services
├── uploads/           #Storage of uploaded images
├── utils/             # Utility functions
├── .env               #Environment variables
├── app.js             # Main entry point of the application
├── package.json      # Dependencies and scripts




git clone https://github.com/SustainaFoodF/backend.git
cd backend
Install the dependencies
bash
Copie
update
npm install
Set up the environment variables
Create a .env file at the root of the project with the following variables:

env
Copier
update
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sustainafood
API_KEY=your_api_key_here
Start the server
bash
Copie
update
npm start
Le serveur sera accessible à l'adresse http://localhost:5001.

🧪 API Endpoints
🔍 Analyse des ingrédients
POST /product/recipes

Description : Analyse les images téléchargées pour détecter les ingrédients.

Corps de la requête : multipart/form-data avec des fichiers image.

Réponse :

json
Copie
update
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
The tests are written using Jest. To run the tests:
bash
Copier
update
npm test
📦 Dépendances principales
express

mongoose

Multer – for file management

axios – for external API calls

JSONWebToken – for authentication

dotenv – for managing environment variables

📄 License
This project is licensed under MIT License.
