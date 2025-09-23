import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  completion: number;
}

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  currentLanguage: Language;
  t: (key: string) => string;
  changeLanguage: (code: string) => void;
  availableLanguages: Language[];
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', completion: 100 },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', completion: 95 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', completion: 85 },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', completion: 75 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', completion: 70 },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', completion: 65 }
];

// Translations object - expandable
const translations: { [key: string]: Translation } = {
  pt: {
    dashboard: 'Dashboard',
    workouts: 'Treinos',
    progress: 'Progresso',
    settings: 'Configurações',
    profile: 'Perfil',
    logout: 'Sair',
    'start-workout': 'Iniciar Treino',
    'workout-history': 'Histórico de Treinos',
    'personal-records': 'Recordes Pessoais',
    'fitness-news': 'Notícias Fitness',
    'community': 'Comunidade',
    'weekly-goal': 'Meta Semanal',
    'consistency': 'Consistência',
    'language-settings': 'Configurações de Idioma',
    'select-language': 'Selecionar Idioma',
    'language-changed': 'Idioma alterado com sucesso!',
    'exercise': 'Exercício',
    'sets': 'Séries',
    'reps': 'Repetições',
    'weight': 'Peso',
    'rest-time': 'Descanso',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'complete-workout': 'Concluir Treino'
  },
  en: {
    dashboard: 'Dashboard',
    workouts: 'Workouts',
    progress: 'Progress',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    'start-workout': 'Start Workout',
    'workout-history': 'Workout History',
    'personal-records': 'Personal Records',
    'fitness-news': 'Fitness News',
    'community': 'Community',
    'weekly-goal': 'Weekly Goal',
    'consistency': 'Consistency',
    'language-settings': 'Language Settings',
    'select-language': 'Select Language',
    'language-changed': 'Language changed successfully!',
    'exercise': 'Exercise',
    'sets': 'Sets',
    'reps': 'Reps',
    'weight': 'Weight',
    'rest-time': 'Rest Time',
    'save': 'Save',
    'cancel': 'Cancel',
    'complete-workout': 'Complete Workout'
  },
  es: {
    dashboard: 'Panel',
    workouts: 'Entrenamientos',
    progress: 'Progreso',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Salir',
    'start-workout': 'Iniciar Entrenamiento',
    'workout-history': 'Historial de Entrenamientos',
    'personal-records': 'Récords Personales',
    'fitness-news': 'Noticias de Fitness',
    'community': 'Comunidad',
    'weekly-goal': 'Meta Semanal',
    'consistency': 'Consistencia',
    'language-settings': 'Configuración de Idioma',
    'select-language': 'Seleccionar Idioma',
    'language-changed': '¡Idioma cambiado exitosamente!',
    'exercise': 'Ejercicio',
    'sets': 'Series',
    'reps': 'Repeticiones',
    'weight': 'Peso',
    'rest-time': 'Descanso',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'complete-workout': 'Completar Entrenamiento'
  },
  fr: {
    dashboard: 'Tableau de Bord',
    workouts: 'Entraînements',
    progress: 'Progrès',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    'start-workout': 'Démarrer Entraînement',
    'workout-history': 'Historique des Entraînements',
    'personal-records': 'Records Personnels',
    'fitness-news': 'Actualités Fitness',
    'community': 'Communauté',
    'weekly-goal': 'Objectif Hebdomadaire',
    'consistency': 'Régularité',
    'language-settings': 'Paramètres de Langue',
    'select-language': 'Sélectionner la Langue',
    'language-changed': 'Langue changée avec succès!',
    'exercise': 'Exercice',
    'sets': 'Séries',
    'reps': 'Répétitions',
    'weight': 'Poids',
    'rest-time': 'Temps de Repos',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'complete-workout': 'Terminer Entraînement'
  },
  de: {
    dashboard: 'Dashboard',
    workouts: 'Training',
    progress: 'Fortschritt',
    settings: 'Einstellungen',
    profile: 'Profil',
    logout: 'Abmelden',
    'start-workout': 'Training Starten',
    'workout-history': 'Trainingshistorie',
    'personal-records': 'Persönliche Rekorde',
    'fitness-news': 'Fitness News',
    'community': 'Community',
    'weekly-goal': 'Wochenziel',
    'consistency': 'Beständigkeit',
    'language-settings': 'Spracheinstellungen',
    'select-language': 'Sprache Auswählen',
    'language-changed': 'Sprache erfolgreich geändert!',
    'exercise': 'Übung',
    'sets': 'Sätze',
    'reps': 'Wiederholungen',
    'weight': 'Gewicht',
    'rest-time': 'Pausenzeit',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'complete-workout': 'Training Beenden'
  },
  it: {
    dashboard: 'Dashboard',
    workouts: 'Allenamenti',
    progress: 'Progresso',
    settings: 'Impostazioni',
    profile: 'Profilo',
    logout: 'Esci',
    'start-workout': 'Inizia Allenamento',
    'workout-history': 'Storico Allenamenti',
    'personal-records': 'Record Personali',
    'fitness-news': 'Notizie Fitness',
    'community': 'Comunità',
    'weekly-goal': 'Obiettivo Settimanale',
    'consistency': 'Costanza',
    'language-settings': 'Impostazioni Lingua',
    'select-language': 'Seleziona Lingua',
    'language-changed': 'Lingua cambiata con successo!',
    'exercise': 'Esercizio',
    'sets': 'Serie',
    'reps': 'Ripetizioni',
    'weight': 'Peso',
    'rest-time': 'Riposo',
    'save': 'Salva',
    'cancel': 'Annulla',
    'complete-workout': 'Completa Allenamento'
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  useEffect(() => {
    // Load saved language
    const savedLanguageCode = localStorage.getItem('app_language') || 'pt';
    const savedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguageCode);
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage.code];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Portuguese if key not found
        value = translations['pt'][key] || key;
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const changeLanguage = (code: string) => {
    const newLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    if (newLanguage) {
      setCurrentLanguage(newLanguage);
      localStorage.setItem('app_language', code);
      // Trigger app re-render
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: code }));
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      t,
      changeLanguage,
      availableLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    changeLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLanguage.flag}</span>
          <span className="hidden lg:inline">{currentLanguage.nativeName}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('select-language')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3">
          {availableLanguages.map((language) => (
            <Button
              key={language.code}
              variant={currentLanguage.code === language.code ? "default" : "ghost"}
              className="justify-start h-auto p-4"
              onClick={() => handleLanguageSelect(language)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{language.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                  >
                    {language.completion}%
                  </Badge>
                  {currentLanguage.code === language.code && (
                    <Check className="h-4 w-4 text-accent" />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-2">
          As traduções são atualizadas regularmente pela comunidade
        </div>
      </DialogContent>
    </Dialog>
  );
}

