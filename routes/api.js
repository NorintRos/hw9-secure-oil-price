const express = require("express");
const router = express.Router();

const BEARER_TOKEN = process.env.BEARER_TOKEN;

const oilPriceData = {
  market: "Global Energy Exchange",
  last_updated: "2026-03-15T12:55:00Z",
  currency: "USD",
  data: [
    { symbol: "WTI", name: "West Texas Intermediate", price: 78.45, change: 0.12 },
    { symbol: "BRENT", name: "Brent Crude", price: 82.30, change: -0.05 },
    { symbol: "NAT_GAS", name: "Natural Gas", price: 2.15, change: 0.02 },
  ],
};

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
