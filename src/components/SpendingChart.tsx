import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

const weeklyData = [
  { name: "Mon", food: 24, shopping: 15, entertainment: 10 },
  { name: "Tue", food: 13, shopping: 25, entertainment: 5 },
  { name: "Wed", food: 38, shopping: 10, entertainment: 15 },
  { name: "Thu", food: 42, shopping: 30, entertainment: 20 },
  { name: "Fri", food: 67, shopping: 45, entertainment: 35 },
  { name: "Sat", food: 89, shopping: 55, entertainment: 40 },
  { name: "Sun", food: 45, shopping: 35, entertainment: 25 },
];

const monthlyData = [
  { name: "Week 1", food: 180, shopping: 150, entertainment: 90 },
  { name: "Week 2", food: 220, shopping: 180, entertainment: 120 },
  { name: "Week 3", food: 190, shopping: 160, entertainment: 100 },
  { name: "Week 4", food: 250, shopping: 200, entertainment: 150 },
];

const categories = [
  { key: "food", color: "hsl(var(--primary))", name: "Food & Drinks" },
  { key: "shopping", color: "#22c55e", name: "Shopping" },
  { key: "entertainment", color: "#f59e0b", name: "Entertainment" },
];

const SpendingChart = () => {
  const [view, setView] = useState("weekly");
  const data = view === "weekly" ? weeklyData : monthlyData;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Spending Overview</CardTitle>
          <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)}>
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
            <BarChart data={data}>
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
                            {categories.find(cat => cat.key === entry.dataKey)?.name}: ${entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                formatter={(value) => {
                  const category = categories.find(cat => cat.key === value);
                  return category ? category.name : value;
                }}
              />
              {categories.map((category) => (
                <Bar
                  key={category.key}
                  dataKey={category.key}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;