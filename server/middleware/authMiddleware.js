const jwt = require("jsonwebtoken");

const admin = require("firebase-admin");
const serviceAccount = require("../../serpay-5ecc7-firebase-adminsdk-izwww-28f37a6bf4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
