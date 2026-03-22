const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const oilPriceData = require("../data/oil-prices");

// POST /login — authenticate with username/password and return a JWT
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.BASIC_AUTH_USER &&
    password === process.env.BASIC_AUTH_PASS
  ) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid username or password." });
});

// JWT authentication middleware
const requireToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Bearer token." });
  }
  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Missing or invalid Bearer token." });
  }
};

// GET /oil-prices — returns oil price data as JSON
router.get("/oil-prices", requireToken, (req, res) => {
  res.json(oilPriceData);
});

module.exports = router;
