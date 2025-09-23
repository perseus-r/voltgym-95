import React from 'react';
import { motion } from 'framer-motion';
import { ProgressOverview } from '@/components/ProgressOverview';
import { AdvancedStats } from '@/components/AdvancedStats';
import { ProgressRanking } from '@/components/ProgressRanking';
import { AchievementsSection } from '@/components/AchievementsSection';
import { HealthMetrics } from '@/components/HealthMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Trophy, Award, Heart, Zap } from 'lucide-react';
import { VoltCard } from '@/components/VoltCard';
import { SmoothTabTransition, StaggeredList } from '@/components/SmoothTransitions';
import { ErrorBoundary } from '@/components/ErrorFallback';

const ProgressoPage = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const tabItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'achievements', label: 'Conquistas', icon: Award },
    { id: 'health', label: 'Saúde', icon: Heart }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg">
        <div className="container-custom pt-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
          {/* Header Premium */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <VoltCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center"
                  >
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </motion.div>
                </div>
                <h1 className="text-2xl font-bold text-white">Progresso Premium</h1>
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <p className="text-txt-2">
                Análise completa da sua evolução com métricas avançadas, rankings e insights personalizados.
              </p>
            </VoltCard>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <VoltCard className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-surface/50 p-1 rounded-xl">
                  {tabItems.map((tab, index) => (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                    >
                      <TabsTrigger 
                        value={tab.id}
                        className="flex items-center gap-1 text-xs md:text-sm data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>

                {/* Tab Content com transições suaves */}
                <div className="mt-6">
                  <SmoothTabTransition isActive={activeTab === 'overview'}>
                    <ProgressOverview />
                  </SmoothTabTransition>

                  <SmoothTabTransition isActive={activeTab === 'analytics'}>
                    <AdvancedStats />
                  </SmoothTabTransition>

                  <SmoothTabTransition isActive={activeTab === 'ranking'}>
                    <ProgressRanking />
                  </SmoothTabTransition>

                  <SmoothTabTransition isActive={activeTab === 'achievements'}>
                    <AchievementsSection />
                  </SmoothTabTransition>

                  <SmoothTabTransition isActive={activeTab === 'health'}>
                    <HealthMetrics />
                  </SmoothTabTransition>
                </div>
              </Tabs>
            </VoltCard>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProgressoPage;