import { ModeToggle } from "@/components/ui/mode-toggle";
import SpendingChart from "@/components/SpendingChart";
import ExpenseCard from "@/components/ExpenseCard";
import BottomNav from "@/components/BottomNav";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const generateHistoricalAndGrowthData = (
    monthlySpending: number,
    monthlySavings: number,
    months: number,
    apy: number = 0.035
  ) => {
    // Generate 3 months of historical data
    const historicalData = Array.from({ length: 3 }, (_, i) => ({
      month: -(2 - i),
      amount: monthlySpending,
      type: 'Historical Spending'
    }));

    // Generate future growth data
    const futureData = Array.from({ length: months }, (_, i) => {
      const totalSavings = monthlySavings * (i + 1);
      const interest = totalSavings * (Math.pow(1 + apy, (i + 1) / 12) - 1);
      return {
        month: i + 1,
        amount: Math.round(totalSavings + interest),
        type: 'Projected Savings'
      };
    });

    return [...historicalData, ...futureData];
  };

  const insights = [
    {
      title: "🎯 Goal Progress: New Car Fund",
      content: "Current spending: $275/month on entertainment & coffee",
      description: "By redirecting your weekend entertainment spending ($180/month) and daily coffee purchases ($95/month) to your car fund, you could reach your goal 8 months sooner.",
      data: generateHistoricalAndGrowthData(275, 275, 24)
    },
    {
      title: "💡 Coffee Shop Savings Potential",
      content: "Current spending: $32/week on coffee shops",
      description: "Your weekend coffee shop visits average $32/week. By brewing premium coffee at home 3 days a week, you could save $68 monthly. This could grow to $856 annually if invested in a high-yield savings account (3.5% APY).",
      data: generateHistoricalAndGrowthData(128, 68, 12)
    },
    {
      title: "📈 Entertainment Budget Optimization",
      content: "Current spending: $180/month on entertainment",
      description: "Your entertainment spending peaks mid-month ($180 average). Consider setting up automatic investments of $100 monthly into a low-cost index fund. Based on historical market returns, this could grow to $14,000 in 10 years.",
      data: generateHistoricalAndGrowthData(180, 100, 36, 0.07)
    },
    {
      title: "🔄 Food Delivery Analysis",
      content: "Current spending: $45-55 per Thursday on delivery",
      description: "You consistently order food delivery on Thursdays ($45-55 range). Meal prepping on Sundays for Thursday dinners could save $160 monthly. This pattern suggests work-related fatigue - consider adjusting your schedule or preparing easy-to-cook meals.",
      data: generateHistoricalAndGrowthData(200, 160, 12)
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Prospr</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <ExpenseCard
            title="Monthly Spending"
            amount={2580}
            trend={12}
            positive={false}
          />
          <ExpenseCard
            title="Monthly Savings"
            amount={890}
            trend={8}
            positive={true}
          />
          <ExpenseCard
            title="Recurring Expenses"
            amount={420}
            trend={-5}
            positive={true}
          />
        </div>

        <SpendingChart />

        <div className="bg-card p-6 rounded-lg border border-border space-y-4">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div 
                  className="cursor-pointer flex justify-between items-center"
                  onClick={() => toggleInsight(index)}
                >
                  <div>
                    <h3 className="font-medium text-primary mb-2">{insight.title}</h3>
                    <div className="space-y-2">
                      <p className="font-medium">{insight.content}</p>
                      <p className="text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  {expandedInsights.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {expandedInsights.includes(index) && (
                  <div className="mt-4 h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insight.data}>
                        <XAxis 
                          dataKey="month" 
                          stroke="#888888"
                          tickFormatter={(value) => {
                            if (value < 0) return `${Math.abs(value)}m ago`;
                            if (value === 0) return 'Now';
                            return `M${value}`;
                          }}
                        />
                        <YAxis
                          stroke="#888888"
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                                  <p className="font-medium">
                                    {data.month < 0 
                                      ? `${Math.abs(data.month)} months ago`
                                      : data.month === 0 
                                      ? 'Now'
                                      : `Month ${data.month}`}
                                  </p>
                                  <p className="text-sm">
                                    {data.type}: ${payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
