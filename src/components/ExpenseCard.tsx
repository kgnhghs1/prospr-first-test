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
          <ArrowUpRight className={positive ? "text-[#62825D]" : "text-[#ea384c]"} />
        ) : (
          <ArrowDownRight className={positive ? "text-[#ea384c]" : "text-[#62825D]"} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${amount.toLocaleString()}</div>
        <p className={`text-xs ${trend > 0 ? (positive ? "text-[#62825D]" : "text-[#ea384c]") : (positive ? "text-[#ea384c]" : "text-[#62825D]")}`}>
          {trend > 0 ? "+" : ""}{trend}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;