import { ModeToggle } from "@/components/ui/mode-toggle";
import SpendingChart from "@/components/SpendingChart";
import ExpenseCard from "@/components/ExpenseCard";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Finance Tracker</h1>
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

        <div className="bg-card p-4 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
          <p className="text-muted-foreground">
            Based on your spending patterns, you could save $127 monthly by reducing coffee shop visits.
            Consider brewing at home 3 days a week.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;