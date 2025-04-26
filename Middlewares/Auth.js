const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

const ensureAuthenticated = async (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers["authorization"];

  // If there's no authorization header, return an unauthorized response
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  // Extract the token by splitting the 'Bearer <token>'
  const token = authHeader.split(" ")[1]; // The token comes after the 'Bearer' part

  if (!token) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is missing" });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const user = await UserModel.findById(id);
    if (user) req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return an unauthorized response
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is invalid or expired" });
  }
};

module.exports = ensureAuthenticated;
