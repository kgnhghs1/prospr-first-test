require("dotenv").config({ path: __dirname + "/.env" });

console.log("🟢 PLAID_CLIENT_ID:", process.env.PLAID_CLIENT_ID);
console.log("🟢 PLAID_SECRET:", process.env.PLAID_SECRET);
console.log("🟢 PLAID_ENV:", process.env.PLAID_ENV);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

console.log("🚀 Server script started...");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

// ✅ Plaid API Configuration
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(config);

// ✅ Add the Missing /create_link_token Route
app.post("/create_link_token", async (req, res) => {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: "user-id" },
        client_name: "Prospr",
        products: ["transactions"],
        country_codes: ["US"],
        language: "en",
        redirect_uri: "http://localhost:8080/account", // Must match exactly what is in Plaid Dashboard
      });
  
      res.json({ link_token: response.data.link_token });
    } catch (error) {
      console.error("❌ Plaid API Error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || "Failed to create link token" });
    }
  });
  

// ✅ Existing /exchange_public_token Route
app.post("/exchange_public_token", async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) {
    return res.status(400).json({ error: "Missing public_token" });
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    res.json({ access_token: response.data.access_token, item_id: response.data.item_id });
  } catch (error) {
    console.error("Plaid Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange public token" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
