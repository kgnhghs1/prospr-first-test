import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { fetchLinkToken, exchangePublicToken, fetchAccounts } from "../lib/plaidService";

const PlaidConnect = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const getLinkToken = async () => {
      const token = await fetchLinkToken();
      setLinkToken(token);
    };
    getLinkToken();
  }, []);

  const onSuccess = async (publicToken: string) => {
    console.log("Public Token:", publicToken);
    const response = await exchangePublicToken(publicToken);
    console.log("Access Token Response:", response);

    // Fetch user accounts after linking
    const accountData = await fetchAccounts();
    setAccounts(accountData);
  };

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });

  return (
    <div className="text-center">
      <button onClick={() => open()} disabled={!ready} className="bg-blue-500 text-white p-2 rounded mb-4">
        Connect Bank Account
      </button>

      {/* Display account info if available */}
      {accounts.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Linked Accounts</h2>
          <ul>
            {accounts.map((acc) => (
              <li key={acc.account_id} className="border-b py-2">
                <strong>{acc.name}</strong> - {acc.subtype} ({acc.type})  
                <br />
                Balance: ${acc.balances.current}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaidConnect;
