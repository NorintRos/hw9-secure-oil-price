const express = require("express");
const router = express.Router();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const oilPriceData = require("../data/oil-prices");

// Bearer Token authentication middleware
const requireBearerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Bearer token." });
  }
  const token = authHeader.slice(7);
  if (token !== BEARER_TOKEN) {
    return res.status(401).json({ error: "Missing or invalid Bearer token." });
  }
  next();
};

// GET /oil-prices — returns oil price data as JSON
router.get("/oil-prices", requireBearerToken, (req, res) => {
  res.json(oilPriceData);
});

module.exports = router;
