import { ModeToggle } from "@/components/ui/mode-toggle";
import SpendingChart from "@/components/SpendingChart";
import ExpenseCard from "@/components/ExpenseCard";
import BottomNav from "@/components/BottomNav";

const Index = () => {
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
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-primary mb-2">💡 Spending Pattern Detected</h3>
              <p className="text-muted-foreground">
                Your weekend coffee shop visits average $32/week. By brewing premium coffee at home 3 days a week, 
                you could save $68 monthly. This could grow to $856 annually if invested in a high-yield savings 
                account (3.5% APY).
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-primary mb-2">📈 Investment Opportunity</h3>
              <p className="text-muted-foreground">
                Your entertainment spending peaks mid-month ($180 average). Consider setting up automatic 
                investments of $100 monthly into a low-cost index fund. Based on historical market returns, 
                this could grow to $14,000 in 10 years.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-primary mb-2">🔄 Weekly Habit Insight</h3>
              <p className="text-muted-foreground">
                You consistently order food delivery on Thursdays ($45-55 range). Meal prepping on Sundays 
                for Thursday dinners could save $160 monthly. This pattern suggests work-related fatigue - 
                consider adjusting your schedule or preparing easy-to-cook meals.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;