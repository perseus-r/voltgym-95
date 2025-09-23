import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSettings } from "@/components/UserSettings";
import { ApiConfig } from "@/components/ApiConfig";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminEmail } from "@/lib/admin";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  
  // Verificar se é administrador
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    document.title = "Configurações — BORA Treinos";
  }, []);

  // Se for admin e quiser ver configurações técnicas
  if (showAdminConfig && isAdmin) {
    return (
      <div className="min-h-screen safe-area">
        <ApiConfig
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setShowAdminConfig(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area pb-24 md:pb-6">
      <div className="safe-area-top p-4 md:p-6 lg:p-8">
        <UserSettings />
        
        {/* Admin Access Button (só se for admin) */}
        {isAdmin && (
          <div className="mt-6 pt-4 border-t border-line/30">
            <button
              onClick={() => setShowAdminConfig(true)}
              className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm"
            >
              🔧 Configurações Administrativas (Apenas Admin)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
