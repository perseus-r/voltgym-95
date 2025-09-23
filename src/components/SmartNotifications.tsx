import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, X, Zap, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'achievement': return <Trophy className="w-5 h-5 text-yellow-400" />;
    case 'reminder': return <Bell className="w-5 h-5 text-blue-400" />;
    case 'milestone': return <Target className="w-5 h-5 text-green-400" />;
    case 'social': return <TrendingUp className="w-5 h-5 text-purple-400" />;
    default: return <Zap className="w-5 h-5 text-accent" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'achievement': return 'from-yellow-500/20 to-amber-500/20';
    case 'reminder': return 'from-blue-500/20 to-cyan-500/20';
    case 'milestone': return 'from-green-500/20 to-emerald-500/20';
    case 'social': return 'from-purple-500/20 to-pink-500/20';
    default: return 'from-accent/20 to-accent-2/20';
  }
};

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simular notificações inteligentes
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Nova Conquista!',
        message: 'Você completou 7 dias consecutivos de treino!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        read: false,
        action: {
          label: 'Ver Conquistas',
          onClick: () => console.log('Opening achievements')
        }
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Hora do Treino!',
        message: 'Seu treino de peito e tríceps está agendado para agora.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
        read: false,
        action: {
          label: 'Iniciar Treino',
          onClick: () => console.log('Starting workout')
        }
      },
      {
        id: '3',
        type: 'milestone',
        title: 'Meta Atingida!',
        message: 'Você atingiu sua meta semanal de 4 treinos!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true
      },
      {
        id: '4',
        type: 'social',
        title: 'Desafio da Comunidade',
        message: 'Participe do desafio "30 dias de força" com outros usuários!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        action: {
          label: 'Participar',
          onClick: () => console.log('Joining challenge')
        }
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost" 
        size="icon"
        className="liquid-glass-button relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-ink text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && createPortal(
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[2990] bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar notificações"
          />

          {/* Panel */}
          <div className="fixed right-4 top-16 w-80 max-h-[70vh] overflow-y-auto z-[3000] animate-fade-in">
            <Card className="liquid-glass bg-surface/95 border border-line/20 shadow-lg backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="p-4 border-b border-glass-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-txt">Notificações</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-txt-3">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-glass-border last:border-b-0 transition-all duration-200 hover:bg-white/5 ${
                          !notification.read ? 'bg-gradient-to-r ' + getNotificationColor(notification.type) : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-semibold ${!notification.read ? 'text-txt' : 'text-txt-2'}`}>
                                {notification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(notification.id);
                                }}
                                className="text-txt-3 hover:text-txt-2 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <p className="text-xs text-txt-3 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-txt-3">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              {notification.action && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-accent hover:text-accent-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notification.action?.onClick();
                                  }}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-glass-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-accent hover:text-accent-2"
                      onClick={() => setNotifications([])}
                    >
                      Limpar Todas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>,
        document.body
      )}

    </div>
  );
}