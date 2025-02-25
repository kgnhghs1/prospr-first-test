import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, useEffect } from "react";

interface SpendingChartProps {
  transactions: any[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const aggregateData = (type: "weekly" | "monthly") => {
      const groupedData: { [key: string]: { [category: string]: number } } = {};
      const now = new Date();
      const pastWeekStart = new Date(now);
      pastWeekStart.setDate(now.getDate() - 6);

      transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        if (type === "weekly" && date < pastWeekStart) return;

        const key = type === "weekly" 
          ? date.toLocaleDateString('en-US', { weekday: 'short' }) 
          : `Month ${date.getMonth() + 1}`;

        const category = transaction.category?.[0] || "Other";
        if (!groupedData[key]) {
          groupedData[key] = {};
        }
        if (!groupedData[key][category]) {
          groupedData[key][category] = 0;
        }
        groupedData[key][category] += transaction.amount;
      });

      // Ensure weekdays are in correct order
      if (type === "weekly") {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return weekdays
          .map((day) => ({ name: day, ...groupedData[day] }))
          .filter((data) => Object.keys(data).length > 1); // Remove empty days
      }

      return Object.keys(groupedData).map((key) => ({ name: key, ...groupedData[key] }));
    };

    setChartData(aggregateData(view));
  }, [transactions, view]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Spending Overview</CardTitle>
          <ToggleGroup type="single" value={view} onValueChange={(value) => {
            if (value === "weekly" || value === "monthly") {
              setView(value);
            }
          }}>
            <ToggleGroupItem value="weekly" aria-label="Weekly view">
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem value="monthly" aria-label="Monthly view">
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                        <p className="font-medium mb-1">{payload[0].payload.name}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm">
                            {entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {Object.keys(chartData[0] || {}).filter((key) => key !== "name").map((category, index) => (
                <Bar key={index} dataKey={category} fill={`hsl(${(index * 80) % 360}, 70%, 50%)`} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
