const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
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
    // Attach the decoded user data to the request object
    req.user = decoded;

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
