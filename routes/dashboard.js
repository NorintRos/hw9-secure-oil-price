const express = require("express");
const basicAuth = require("express-basic-auth");
const router = express.Router();

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

// Basic Auth middleware
const requireBasicAuth = basicAuth({
  users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS },
  challenge: true,
  realm: "Energy Dashboard",
});

// GET /dashboard — renders oil price table (Basic Auth protected)
router.get("/dashboard", requireBasicAuth, (req, res) => {
  res.render("dashboard", {
    title: "Energy Dashboard",
    market: oilPriceData.market,
    lastUpdated: oilPriceData.last_updated,
    currency: oilPriceData.currency,
    prices: oilPriceData.data,
  });
});

// GET /logout — clears cached Basic Auth credentials
router.get("/logout", (req, res) => {
  if (req.headers.authorization) {
    res.set("WWW-Authenticate", 'Basic realm="Energy Dashboard"');
    return res.status(401).render("logout", { title: "Logged Out" });
  }
  res.render("logout", { title: "Logged Out" });
});

module.exports = router;
