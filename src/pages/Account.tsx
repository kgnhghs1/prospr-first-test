import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { 
  User, Mail, Phone, Fingerprint, Bell, 
  Lock, ShieldCheck, Info, ChevronRight, Circle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import { fetchAccounts } from "@/lib/plaidService";  // Import API function

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(
    !!localStorage.getItem("plaid_access_token") // Check if token exists in storage
  );
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Plaid Link Token on Mount
  useEffect(() => {
    fetch("http://localhost:8000/create_link_token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setLinkToken(data.link_token))
      .catch((error) => console.error("Error fetching link token:", error));
  }, []);

  // Retrieve stored access token on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("plaid_access_token");
    if (storedToken) {
      fetchAccounts().then((accountData) => {
        setAccounts(accountData);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Handle Plaid Connection
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess: async (public_token) => {
      console.log("Public Token:", public_token);

      // Exchange public token for access token
      try {
        const response = await fetch("http://localhost:8000/exchange_public_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("plaid_access_token", data.access_token); // Save access token
          setIsConnected(true);

          // Fetch user accounts
          const accountData = await fetchAccounts();
          setAccounts(accountData);
        }
      } catch (error) {
        console.error("Error exchanging token or fetching accounts:", error);
      }
    },
  });

  const sections = [
    {
      title: "Account Information",
      items: [
        { icon: <User size={20} />, label: "Profile", path: "/account/profile" },
        { icon: <Mail size={20} />, label: "Email", path: "/account/email" },
        { icon: <Phone size={20} />, label: "Phone Number", path: "/account/phone" }
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { icon: <Fingerprint size={20} />, label: "Face ID & Passcode", path: "/account/face-id" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/account/notifications" },
        { icon: <Lock size={20} />, label: "Password & Security", path: "/account/security" },
      ]
    },
    {
      title: "Support & Legal",
      items: [
        { icon: <Info size={20} />, label: "About", path: "/account/about" },
        { icon: <ShieldCheck size={20} />, label: "Privacy Policy", path: "/account/privacy" },
        { icon: <Info size={20} />, label: "Terms of Service", path: "/account/terms" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border p-4">
        <h1 className="text-xl font-bold">Account</h1>
      </header>
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground px-2">
              {section.title}
            </h2>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                    index !== section.items.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="text-muted-foreground" size={18} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* 🔹 Bank Accounts Section */}
        {accounts.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground px-2">Linked Bank Accounts</h2>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {loading ? (
                <p className="p-4 text-gray-500">Loading accounts...</p>
              ) : (
                accounts.map((acc) => (
                  <div key={acc.account_id} className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{acc.name}</h3>
                        <p className="text-sm text-gray-500">{acc.subtype} ({acc.type})</p>
                      </div>
                      <p className="text-lg font-bold">${acc.balances.current}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 🔹 Plaid Connect Button */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => open()}
            disabled={!ready}
            className={cn(
              "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
              "border-b border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-primary"><ShieldCheck size={20} /></span>
              <span>Connect Your Bank Account</span>
              <Circle size={14} className={cn("rounded-full", isConnected ? "bg-green-500" : "bg-gray-500")} />
            </div>
            <ChevronRight className="text-muted-foreground" size={18} />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Account;
