import { Home, PieChart, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <NavItem icon={<Home size={24} />} label="Home" active />
        <NavItem icon={<PieChart size={24} />} label="Analytics" />
        <NavItem icon={<CreditCard size={24} />} label="Transactions" />
        <NavItem icon={<Settings size={24} />} label="Settings" />
      </div>
    </nav>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
}) => (
  <button
    className={cn(
      "flex flex-col items-center p-2 rounded-lg transition-colors",
      active ? "text-primary" : "text-muted-foreground hover:text-primary"
    )}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default BottomNav;