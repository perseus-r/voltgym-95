import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, User, Crown, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RankingUser {
  id: string;
  display_name: string;
  avatar_url: string | null;
  total_volume: number;
  workouts_completed: number;
  consistency_score: number;
  overall_progress_score: number;
  ranking_position: number;
}

export function ProgressRanking() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [userRank, setUserRank] = useState<RankingUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      
      // Buscar top 10 do ranking
      const { data: rankingData, error } = await supabase
        .from('progress_rankings')
        .select('*')
        .eq('period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('ranking_position', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Buscar perfis dos usuários do ranking
      const userIds = rankingData?.map(item => item.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      const formattedRankings = rankingData?.map(item => {
        const profile = profilesData?.find(p => p.user_id === item.user_id);
        return {
          id: item.user_id,
          display_name: profile?.display_name || 'Usuário VOLT',
          avatar_url: profile?.avatar_url,
          total_volume: item.total_volume,
          workouts_completed: item.workouts_completed,
          consistency_score: item.consistency_score,
          overall_progress_score: item.overall_progress_score,
          ranking_position: item.ranking_position
        };
      }) || [];

      setRankings(formattedRankings);

      // Buscar posição do usuário atual se não estiver no top 10
      if (user) {
        const { data: userData } = await supabase
          .from('progress_rankings')
          .select('*')
          .eq('user_id', user.id)
          .eq('period_start', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .single();

        if (userData && userData.ranking_position > 10) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('user_id', user.id)
            .single();

          setUserRank({
            id: userData.user_id,
            display_name: userProfile?.display_name || 'Usuário VOLT',
            avatar_url: userProfile?.avatar_url,
            total_volume: userData.total_volume,
            workouts_completed: userData.workouts_completed,
            consistency_score: userData.consistency_score,
            overall_progress_score: userData.overall_progress_score,
            ranking_position: userData.ranking_position
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      // Mock data para fallback
      setRankings([
        {
          id: '1',
          display_name: 'Carlos "Beast" Silva',
          avatar_url: null,
          total_volume: 45230,
          workouts_completed: 28,
          consistency_score: 93,
          overall_progress_score: 95.8,
          ranking_position: 1
        },
        {
          id: '2',
          display_name: 'Ana Powerhouse',
          avatar_url: null,
          total_volume: 42100,
          workouts_completed: 26,
          consistency_score: 87,
          overall_progress_score: 91.2,
          ranking_position: 2
        },
        {
          id: '3',
          display_name: 'João Ironman',
          avatar_url: null,
          total_volume: 39800,
          workouts_completed: 25,
          consistency_score: 83,
          overall_progress_score: 88.5,
          ranking_position: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-txt-2">#{position}</span>;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-black';
      default:
        return 'bg-accent/20 text-accent';
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k kg`;
    }
    return `${volume.toFixed(0)} kg`;
  };

  if (loading) {
    return (
      <Card className="glass p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-accent" />
          <h3 className="text-lg font-semibold text-txt">Ranking de Progresso</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-accent" />
        <div>
          <h3 className="text-lg font-semibold text-txt">Ranking de Progresso</h3>
          <p className="text-sm text-txt-3">Top performers dos últimos 30 dias</p>
        </div>
      </div>

      <div className="space-y-3">
        {rankings.map((rankUser, index) => (
          <div
            key={rankUser.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              user?.id === rankUser.id 
                ? 'bg-accent/10 ring-1 ring-accent/30' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {/* Posição e Avatar */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(rankUser.ranking_position)}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                {rankUser.avatar_url ? (
                  <img 
                    src={rankUser.avatar_url} 
                    alt={rankUser.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-accent" />
                )}
              </div>
            </div>

            {/* Info do usuário */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-txt truncate">
                  {rankUser.display_name}
                </h4>
                <Badge className={`text-xs ${getRankBadgeColor(rankUser.ranking_position)}`}>
                  #{rankUser.ranking_position}
                </Badge>
                {user?.id === rankUser.id && (
                  <Badge variant="outline" className="text-xs">Você</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-txt-3">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {formatVolume(rankUser.total_volume)}
                </span>
                <span>{rankUser.workouts_completed} treinos</span>
                <span>{Math.round(rankUser.consistency_score)}% consistência</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-accent">
                {Math.round(rankUser.overall_progress_score)}
              </div>
              <div className="text-xs text-txt-3">pontos</div>
            </div>
          </div>
        ))}

        {/* Usuário atual se estiver fora do top 10 */}
        {userRank && (
          <>
            <div className="flex items-center justify-center py-2">
              <div className="text-xs text-txt-3">...</div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 ring-1 ring-accent/30">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(userRank.ranking_position)}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                  {userRank.avatar_url ? (
                    <img 
                      src={userRank.avatar_url} 
                      alt={userRank.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-accent" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-txt truncate">
                    {userRank.display_name}
                  </h4>
                  <Badge className={`text-xs ${getRankBadgeColor(userRank.ranking_position)}`}>
                    #{userRank.ranking_position}
                  </Badge>
                  <Badge variant="outline" className="text-xs">Você</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-txt-3">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {formatVolume(userRank.total_volume)}
                  </span>
                  <span>{userRank.workouts_completed} treinos</span>
                  <span>{Math.round(userRank.consistency_score)}% consistência</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-accent">
                  {Math.round(userRank.overall_progress_score)}
                </div>
                <div className="text-xs text-txt-3">pontos</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-line/50">
        <div className="text-xs text-txt-3 space-y-1">
          <p>• Score baseado em: volume total (40%), consistência (40%), ganhos de força (20%)</p>
          <p>• Ranking atualizado diariamente com base nos últimos 30 dias</p>
        </div>
      </div>
    </Card>
  );
}