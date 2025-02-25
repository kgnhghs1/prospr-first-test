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
let accessToken = null; // Store the access token in memory (Replace with a DB in production)

// ✅ Create Link Token Route
app.post("/create_link_token", async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: "user-id" },
      client_name: "Prospr",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
      redirect_uri: "http://localhost:8080/account",
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("❌ Plaid API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create link token" });
  }
});

// ✅ Exchange Public Token Route
app.post("/exchange_public_token", async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) {
    return res.status(400).json({ error: "Missing public_token" });
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    accessToken = response.data.access_token;
    res.json({ access_token: response.data.access_token, item_id: response.data.item_id });
  } catch (error) {
    console.error("Plaid Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange public token" });
  }
});

// ✅ Fetch Account Information
app.get("/accounts", async (req, res) => {
  if (!accessToken) return res.status(400).json({ error: "No access token" });

  try {
    const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
    res.json(accountsResponse.data.accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// ✅ Fetch Transactions with Pagination
app.get("/transactions", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token

  console.log("🟡 Received token:", token); // Debugging log

  if (!token) {
    return res.status(400).json({ error: "No access token provided" });
  }

  try {
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: token,
      start_date: "2024-01-01",
      end_date: new Date().toISOString().split("T")[0],
    });

    console.log("🟢 Retrieved Transactions:", transactionsResponse.data.transactions.length);
    res.json(transactionsResponse.data.transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
