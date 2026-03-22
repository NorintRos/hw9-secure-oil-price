const express = require("express");
const basicAuth = require("express-basic-auth");
const router = express.Router();
const oilPriceData = require("../data/oil-prices");

// GET /login — renders login form
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

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
