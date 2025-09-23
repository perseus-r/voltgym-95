import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { ApiConfig } from "./ApiConfig";
import { UserProfile } from "./UserProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const TopBar = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isPro, isPremium, openCustomerPortal } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error('Erro ao abrir portal de gerenciamento');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-6 border-b border-line/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-xl font-bold text-accent-ink">V</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">VOLT</h1>
            <p className="text-sm text-text-2">Treinos Inteligentes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-1">
                  <UserProfile />
                </div>
                <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                {isPro && (
                  <DropdownMenuItem onClick={handleManageSubscription}>
                    <Crown className="w-4 h-4 mr-2" />
                    Gerenciar assinatura
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <ApiConfig
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
      />
    </>
  );
};

export default TopBar;