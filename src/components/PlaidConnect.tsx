import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidConnect: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching link token...");
    fetch("http://localhost:8000/create_link_token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Link Token Received:", data.link_token);
        setLinkToken(data.link_token);
      })
      .catch((error) => console.error("❌ Error fetching link token:", error));
  }, []);

  const onSuccess = (public_token: string) => {
    console.log("✅ Public Token Received:", public_token);
    setPublicToken(public_token);

    fetch("http://localhost:8000/exchange_public_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Access Token:", data.access_token))
      .catch((error) => console.error("❌ Error exchanging token:", error));
  };

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Connect Your Bank Account
      </button>
      {publicToken && <p>Public Token: {publicToken}</p>}
    </div>
  );
};

export default PlaidConnect;
