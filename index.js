const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const FileRouter = require("./Routes/FileRouter");
const AuthRouter = require("./Routes/AuthRouter");
const UsersRouter = require("./Routes/UsersRouter");
const UserRoute = require("./Routes/UserRoute");
const PostRouter = require("./Routes/PostRouter");
const CommentRouter = require("./Routes/CommentRouter");
const CategoryRouter = require("./Routes/categoryRouter");
const ProductRouter = require("./Routes/productRouter");
const CommandRouter = require("./Routes/CommandRouter");
const StatsRouter = require("./Routes/StatsRouter");
const StripeRouter = require("./Routes/StripeRouter");
const MessageRouter = require("./Routes/MessageRouter")

const TaskRoutes = require("./Routes/taskRoutes");
const NotificationRouter = require('./Routes/notificationRouter');

const RecipeRouter = require("./Routes/RecipeRouter");

const app = express();
const PORT = process.env.PORT || 5001;
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { tryToLoginWithGoogle } = require("./Controllers/AuthController");
require("./Cron/notifyExpiringProducts");

require("./config/passeportConfig"); // Google OAuth strategy
app.use(express.static("public"));

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google Auth Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback Route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return tryToLoginWithGoogle(req, res);
  }
);
const mongo_url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/commerce";
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/users", UsersRouter);
app.use("/user", UserRoute);
app.use("/posts", PostRouter);
app.use("/comments", CommentRouter);
app.use("/files", FileRouter); // Now accessible via /files/upload
app.use("/category", CategoryRouter);
app.use("/product", ProductRouter);
app.use("/command", CommandRouter);
app.use("/stats", StatsRouter);
app.use("/payment", StripeRouter);
app.use('/livreur/tasks', TaskRoutes);
app.use('/messages',MessageRouter);

app.use('/notifications', NotificationRouter);

app.use("/recipe", RecipeRouter);

// Configuration Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Commerce API",
      description: "API documentation for authentication and user management",
      version: "1.0.0",
      contact: {
        name: "Your Name",
        email: "your.email@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./Routes/*.js"], // Spécifier où sont les routes documentées
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
