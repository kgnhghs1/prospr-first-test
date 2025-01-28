import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ExpenseCardProps {
  title: string;
  amount: number;
  trend: number;
  positive?: boolean;
}

const ExpenseCard = ({ title, amount, trend, positive = false }: ExpenseCardProps) => {
  return (
    <Card className="card-shine">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend > 0 ? (
          <ArrowUpRight className={positive ? "text-green-500" : "text-red-500"} />
        ) : (
          <ArrowDownRight className={positive ? "text-red-500" : "text-green-500"} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${amount.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          {trend > 0 ? "+" : ""}{trend}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;