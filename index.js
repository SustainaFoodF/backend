const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const AuthRouter = require('./Routes/AuthRouter');

const app = express();
const PORT = process.env.PORT || 5001;

// Connexion à MongoDB
const mongo_url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/commerce';
mongoose.connect(mongo_url)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Middleware
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); 
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/',AuthRouter);

// Configuration Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Commerce API',
            description: 'API documentation for authentication and user management',
            version: '1.0.0',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local server'
            }
        ]
    },
    apis: ['./Routes/AuthRouter.js'], // Spécifier où sont les routes documentées
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
