import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

const queryClient = new QueryClient();

const PlaidConnect = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/create_link_token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setLinkToken(data.link_token));
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
      .then((data) => console.log("✅ Access Token:", data.access_token));
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

const AccountWithPlaid = () => (
  <div>
    <Account />
    <PlaidConnect />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="finance-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/account" element={<AccountWithPlaid />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
