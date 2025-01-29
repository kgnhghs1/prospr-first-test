import { Home, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <NavItem 
          icon={<Home size={24} />} 
          label="Home" 
          active={location.pathname === '/'} 
          onClick={() => navigate('/')}
        />
        <NavItem 
          icon={<PieChart size={24} />} 
          label="Analytics" 
          active={location.pathname === '/analytics'}
          onClick={() => navigate('/analytics')}
        />
        <NavItem 
          icon={<Settings size={24} />} 
          label="Settings" 
          active={location.pathname === '/settings'}
          onClick={() => navigate('/settings')}
        />
      </div>
    </nav>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "flex flex-col items-center p-2 rounded-lg transition-colors",
      active ? "text-primary" : "text-muted-foreground hover:text-primary"
    )}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default BottomNav;