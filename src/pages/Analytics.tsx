import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import BottomNav from "@/components/BottomNav";

const spendingByCategory = [
  { name: "Food & Drinks", value: 890, color: "hsl(var(--primary))" },
  { name: "Shopping", value: 750, color: "#22c55e" },
  { name: "Entertainment", value: 340, color: "#f59e0b" },
  { name: "Transportation", value: 280, color: "#6366f1" },
  { name: "Bills", value: 320, color: "#ec4899" }
];

const monthlyTrends = [
  { category: "Food & Drinks", trend: "+12%", amount: "$890", previousMonth: "$795" },
  { category: "Shopping", trend: "-5%", amount: "$750", previousMonth: "$790" },
  { category: "Entertainment", trend: "+8%", amount: "$340", previousMonth: "$315" },
  { category: "Transportation", trend: "-2%", amount: "$280", previousMonth: "$286" },
  { category: "Bills", trend: "0%", amount: "$320", previousMonth: "$320" }
];

const Analytics = () => {
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
                  <Tooltip 
                    formatter={(value: number) => [`$${value}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Category Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">vs. last month: {item.previousMonth}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.amount}</p>
                    <p className={cn(
                      "text-sm",
                      item.trend.startsWith("+") ? "text-[#62825D]" : 
                      item.trend.startsWith("-") ? "text-[#ea384c]" : 
                      "text-muted-foreground"
                    )}>
                      {item.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Analytics;