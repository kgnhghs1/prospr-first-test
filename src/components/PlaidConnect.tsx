import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidConnect: React.FC<{ onOpen: (openFn: () => void) => void }> = ({ onOpen }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/create_link_token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setLinkToken(data.link_token))
      .catch((error) => console.error("Error fetching link token:", error));
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess: (public_token) => console.log("Public Token:", public_token),
  });

  useEffect(() => {
    if (ready && onOpen) onOpen(() => open());
  }, [ready]); // ✅ Only updates when ready changes

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary">🔗</span>
        <span>Connect Your Bank Account</span>
      </div>
    </button>
  );
};

export default PlaidConnect;
