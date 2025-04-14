export const fetchLinkToken = async () => {
    const response = await fetch("http://localhost:8000/create_link_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.link_token;
  };
  
  export const exchangePublicToken = async (publicToken: string) => {
    const response = await fetch("http://localhost:8000/exchange_public_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: publicToken }),
    });
    return response.json();
  };

  export const fetchAccounts = async () => {
    const response = await fetch("http://localhost:8000/accounts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  };
  export const fetchTransactions = async () => {
    const accessToken = localStorage.getItem("plaid_access_token"); // Retrieve stored token
  
    if (!accessToken) {
      console.error("❌ No access token found in localStorage");
      throw new Error("No access token available.");
    }
  
    console.log("🟡 Sending request with token:", accessToken); // Debugging log
  
    const response = await fetch("http://localhost:8000/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // Send token in headers
      },
    });
  
    if (!response.ok) {
      console.error("❌ API Error:", await response.text());
      throw new Error("Failed to fetch transactions.");
    }
  
    return response.json();
  };
  