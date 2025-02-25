import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import SpendingChart from "@/components/SpendingChart";
import ExpenseCard from "@/components/ExpenseCard";
import BottomNav from "@/components/BottomNav";
import { fetchTransactions } from "@/lib/plaidService";
import { ChevronDown, ChevronUp } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [spendingSummary, setSpendingSummary] = useState({
    totalSpending: 0,
    totalSavings: 0,
    recurringExpenses: 0,
  });
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem("plaid_access_token");
    if (!token) {
      console.error("❌ No access token in localStorage, skipping request");
      return;
    }

    fetchTransactions()
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
          calculateSpendingSummary(data);
        } else {
          console.error("❌ Unexpected API response:", data);
        }
      })
      .catch((error) => console.error("❌ Error fetching transactions:", error));
  }, []);

  const calculateSpendingSummary = (transactions: any[]) => {
    let totalSpending = 0;
    let recurringExpenses = 0;
    const recurringKeywords = ["Subscription", "Rent", "Utility", "Membership"];

    transactions.forEach((transaction) => {
      totalSpending += transaction.amount;
      if (recurringKeywords.some((keyword) => transaction.name.includes(keyword))) {
        recurringExpenses += transaction.amount;
      }
    });

    setSpendingSummary({
      totalSpending: Math.round(totalSpending),
      totalSavings: Math.round(totalSpending * 0.35),
      recurringExpenses: Math.round(recurringExpenses),
    });
  };

  const insights = [
    {
      title: "🎯 Goal Progress: New Car Fund",
      content: "Current spending: $275/month on entertainment & coffee",
      description: "By redirecting your weekend entertainment spending ($180/month) and daily coffee purchases ($95/month) to your car fund, you could reach your goal 8 months sooner.",
    },
    {
      title: "💡 Coffee Shop Savings Potential",
      content: "Current spending: $32/week on coffee shops",
      description: "Your weekend coffee shop visits average $32/week. By brewing premium coffee at home 3 days a week, you could save $68 monthly. This could grow to $856 annually if invested in a high-yield savings account (3.5% APY).",
    },
    {
      title: "📈 Entertainment Budget Optimization",
      content: "Current spending: $180/month on entertainment",
      description: "Your entertainment spending peaks mid-month ($180 average). Consider setting up automatic investments of $100 monthly into a low-cost index fund. Based on historical market returns, this could grow to $14,000 in 10 years.",
    },
    {
      title: "🔄 Food Delivery Analysis",
      content: "Current spending: $45-55 per Thursday on delivery",
      description: "You consistently order food delivery on Thursdays ($45-55 range). Meal prepping on Sundays for Thursday dinners could save $160 monthly. This pattern suggests work-related fatigue - consider adjusting your schedule or preparing easy-to-cook meals.",
    }
  ];

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
          <ExpenseCard title="Monthly Spending" amount={spendingSummary.totalSpending} trend={12} positive={false} />
          <ExpenseCard title="Monthly Savings" amount={spendingSummary.totalSavings} trend={8} positive={true} />
          <ExpenseCard title="Recurring Expenses" amount={spendingSummary.recurringExpenses} trend={-5} positive={true} />
        </div>

        <SpendingChart transactions={transactions} />

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
