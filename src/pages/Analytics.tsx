import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { fetchTransactions } from "@/lib/plaidService"; // Import API function

const Analytics = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("plaid_access_token");
    if (!token) {
      console.error("❌ No access token in localStorage, skipping request");
      setLoading(false);
      return;
    }

    fetchTransactions()
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("❌ Unexpected API response:", data);
        }
      })
      .catch((error) => console.error("❌ Error fetching transactions:", error))
      .finally(() => setLoading(false));
  }, []);

  // Ensure transactions is an array before using reduce()
  const groupedTransactions = transactions.length
    ? transactions.reduce((acc, transaction) => {
        const category = transaction.category?.[0] || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(transaction);
        return acc;
      }, {} as Record<string, any[]>)
    : {};

  // Pie Chart Data
  const spendingByCategory = Object.keys(groupedTransactions).map((category, index) => ({
    name: category,
    value: groupedTransactions[category].reduce((sum, t) => sum + t.amount, 0),
    color: ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63", "#9C27B0"][index % 5],
  }));

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <p>Loading data...</p>
              ) : spendingByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No spending data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions by Category */}
        {Object.keys(groupedTransactions).map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{category}</span>
                <span className="text-sm font-normal text-muted-foreground">Recent Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedTransactions[category].map((transaction, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {!loading && transactions.length === 0 && (
          <p className="text-gray-500 text-center">No transactions available. Please connect your bank.</p>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Analytics;
