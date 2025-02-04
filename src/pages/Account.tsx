import { 
  User, Mail, Phone, Fingerprint, Bell, 
  Lock, ShieldCheck, Info, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Account = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Account Information",
      items: [
        { icon: <User size={20} />, label: "Profile", path: "/account/profile" },
        { icon: <Mail size={20} />, label: "Email", path: "/account/email" },
        { icon: <Phone size={20} />, label: "Phone Number", path: "/account/phone" }
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { icon: <Fingerprint size={20} />, label: "Face ID & Passcode", path: "/account/face-id" },
        { icon: <Bell size={20} />, label: "Notifications", path: "/account/notifications" },
        { icon: <Lock size={20} />, label: "Password & Security", path: "/account/security" },
      ]
    },
    {
      title: "Support & Legal",
      items: [
        { icon: <Info size={20} />, label: "About", path: "/account/about" },
        { icon: <ShieldCheck size={20} />, label: "Privacy Policy", path: "/account/privacy" },
        { icon: <Info size={20} />, label: "Terms of Service", path: "/account/terms" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-border p-4">
        <h1 className="text-xl font-bold">Account</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground px-2">
              {section.title}
            </h2>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                    index !== section.items.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="text-muted-foreground" size={18} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Account;