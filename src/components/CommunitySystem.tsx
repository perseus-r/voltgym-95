import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, MessageCircle, Share2, Trophy, Flame, Users, TrendingUp, Bot, ThumbsUp, Plus, Search, Filter, Send, Eye } from "lucide-react";

interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  workout_data?: {
    name: string;
    volume: number;
    duration: number;
    exercises: number;
  };
  likes_count: number;
  comments_count: number;
  created_at: string;
  type: 'user' | 'ai' | 'news';
  user_profiles?: {
    display_name: string;
    current_xp: number;
  };
  liked_by_user?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profiles?: {
    display_name: string;
  };
}

export function CommunitySystem() {
  // Redirecionar para o novo componente de rede social
  return (
    <div className="liquid-glass p-8 text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-txt mb-2">🚀 Nova Rede Social VOLT</h2>
        <p className="text-txt-2">A comunidade evoluiu! Agora com uploads de mídia, IA automática e muito mais.</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="liquid-glass p-4 rounded-lg">
            <div className="text-2xl mb-2">📸</div>
            <div className="text-sm text-txt">Upload de Mídia</div>
          </div>
          <div className="liquid-glass p-4 rounded-lg">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm text-txt">IA Automática</div>
          </div>
          <div className="liquid-glass p-4 rounded-lg">
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-sm text-txt">Navegação Inteligente</div>
          </div>
        </div>
        
        <p className="text-txt-3 text-sm">
          Acesse a nova rede social através do menu lateral ou botão "Comunidade" no dashboard principal.
        </p>
      </div>
    </div>
  );
}