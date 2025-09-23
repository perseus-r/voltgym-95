import { UserProfile, Plan, Exercise, PlanExercise, Session, VibeLog, AIChat, ProgressMetric } from '@/types';

// Seed data following the master prompt specification

export const seedUserProfile: UserProfile = {
  id: 'demo-user',
  objetivo: 'massa',
  nivel: 2,
  peso: 75,
  altura: 180,
  sexo: 'M',
  preferenciaMusica: 'Rock/EDM'
};

export const seedPlans: Plan[] = [
  {
    id: 'ppl-push',
    nome: 'Push (Peito/Ombro/Tríceps)',
    foco: 'Push Power',
    diasSemana: 4,
    createdAt: '2025-01-01'
  },
  {
    id: 'ppl-pull',
    nome: 'Pull (Costas/Bíceps)',
    foco: 'Pull Domination',
    diasSemana: 4,
    createdAt: '2025-01-01'
  },
  {
    id: 'ppl-legs',
    nome: 'Legs (Pernas/Glúteos)',
    foco: 'Leg Crusher',
    diasSemana: 4,
    createdAt: '2025-01-01'
  },
  {
    id: 'upper-body',
    nome: 'Upper Body Blast',
    foco: 'Upper Complete',
    diasSemana: 4,
    createdAt: '2025-01-01'
  }
];

export const seedExercises: Exercise[] = [
  // PEITO
  {
    id: 'supino-reto-barra',
    nome: 'Supino reto (barra)',
    grupo: 'peito',
    dicaCurta: 'Pés firmes; escápulas retraídas; barra na linha do mamilo'
  },
  {
    id: 'supino-reto-halteres',
    nome: 'Supino reto (halteres)',
    grupo: 'peito',
    dicaCurta: 'Amplitude completa; controle o movimento'
  },
  {
    id: 'supino-inclinado-barra',
    nome: 'Supino inclinado (barra)',
    grupo: 'peito',
    dicaCurta: 'Inclinação de 30-45 graus; foque na porção superior'
  },
  {
    id: 'supino-inclinado-halteres',
    nome: 'Supino inclinado (halteres)',
    grupo: 'peito',
    dicaCurta: 'Mantenha os ombros para trás; amplitude completa'
  },
  {
    id: 'supino-declinado-barra',
    nome: 'Supino declinado (barra)',
    grupo: 'peito',
    dicaCurta: 'Foque na porção inferior; mantenha estabilidade'
  },
  {
    id: 'supino-declinado-halteres',
    nome: 'Supino declinado (halteres)',
    grupo: 'peito',
    dicaCurta: 'Amplitude completa; controle o movimento'
  },
  {
    id: 'crucifixo-banco',
    nome: 'Crucifixo no banco (halteres)',
    grupo: 'peito',
    dicaCurta: 'Movimento em arco; não dobre muito os cotovelos'
  },
  {
    id: 'crossover-cabo',
    nome: 'Crossover no cabo',
    grupo: 'peito',
    dicaCurta: 'Movimento em arco; contração no final'
  },
  {
    id: 'peck-deck',
    nome: 'Peck deck (máquina)',
    grupo: 'peito',
    dicaCurta: 'Postura ereta; movimento controlado'
  },
  {
    id: 'flexao-bracos',
    nome: 'Flexão de braço',
    grupo: 'peito',
    dicaCurta: 'Corpo rígido; amplitude completa'
  },
  {
    id: 'mergulho-peito',
    nome: 'Mergulho em paralelas (ênfase peito)',
    grupo: 'peito',
    dicaCurta: 'Tronco inclinado; cotovelos próximos'
  },

  // COSTAS
  {
    id: 'barra-fixa-pronada',
    nome: 'Barra fixa (pronada)',
    grupo: 'costas',
    dicaCurta: 'Ombros para baixo; movimento controlado'
  },
  {
    id: 'barra-fixa-supinada',
    nome: 'Barra fixa (supinada)',
    grupo: 'costas',
    dicaCurta: 'Ativação do bíceps; amplitude completa'
  },
  {
    id: 'puxada-frente',
    nome: 'Puxada na frente (pulldown)',
    grupo: 'costas',
    dicaCurta: 'Peito para fora; ombros para baixo'
  },
  {
    id: 'remada-curvada-barra',
    nome: 'Remada curvada (barra)',
    grupo: 'costas',
    dicaCurta: 'Coluna neutra; pausa na contração'
  },
  {
    id: 'remada-unilateral',
    nome: 'Remada unilateral (halter)',
    grupo: 'costas',
    dicaCurta: 'Estabilidade no core; amplitude completa'
  },
  {
    id: 'remada-baixa-cabo',
    nome: 'Remada baixa (cabo)',
    grupo: 'costas',
    dicaCurta: 'Peito para fora; movimento controlado'
  },
  {
    id: 'remada-cavalinho',
    nome: 'Remada cavalinho (T-bar)',
    grupo: 'costas',
    dicaCurta: 'Coluna neutra; pegada firme'
  },
  {
    id: 'levantamento-terra',
    nome: 'Levantamento terra',
    grupo: 'costas',
    dicaCurta: 'Coluna neutra; bracing abdominal'
  },
  {
    id: 'pull-over',
    nome: 'Pull-over (halter)',
    grupo: 'costas',
    dicaCurta: 'Movimento em arco; respiração controlada'
  },

  // OMBROS (DELTOIDES)
  {
    id: 'desenvolvimento-militar-barra',
    nome: 'Desenvolvimento militar (barra)',
    grupo: 'ombros',
    dicaCurta: 'Core contraído; movimento vertical'
  },
  {
    id: 'desenvolvimento-halteres',
    nome: 'Desenvolvimento (halteres)',
    grupo: 'ombros',
    dicaCurta: 'Amplitude completa; controle total'
  },
  {
    id: 'elevacao-lateral',
    nome: 'Elevação lateral',
    grupo: 'ombros',
    dicaCurta: 'Movimento controlado; não balançar'
  },
  {
    id: 'elevacao-frontal',
    nome: 'Elevação frontal',
    grupo: 'ombros',
    dicaCurta: 'Movimento controlado; amplitude limitada'
  },
  {
    id: 'elevacao-posterior',
    nome: 'Elevação posterior (reverse fly)',
    grupo: 'ombros',
    dicaCurta: 'Tronco inclinado; movimento em arco'
  },
  {
    id: 'remada-alta',
    nome: 'Remada alta',
    grupo: 'ombros',
    dicaCurta: 'Cotovelos acima das mãos; pegada fechada'
  },
  {
    id: 'face-pull',
    nome: 'Face pull',
    grupo: 'ombros',
    dicaCurta: 'Cotovelos altos; separar as mãos'
  },

  // QUADRÍCEPS
  {
    id: 'agachamento-livre',
    nome: 'Agachamento livre (back squat)',
    grupo: 'quadriceps',
    dicaCurta: 'Bracing abdominal; olhar estável'
  },
  {
    id: 'agachamento-frontal',
    nome: 'Agachamento frontal (front squat)',
    grupo: 'quadriceps',
    dicaCurta: 'Cotovelos altos; core contraído'
  },
  {
    id: 'leg-press',
    nome: 'Leg press',
    grupo: 'quadriceps',
    dicaCurta: 'Amplitude completa; pés paralelos'
  },
  {
    id: 'passada-afundo',
    nome: 'Passada/Afundo',
    grupo: 'quadriceps',
    dicaCurta: 'Joelho não passa do pé; estabilidade no core'
  },
  {
    id: 'hack-squat',
    nome: 'Hack squat',
    grupo: 'quadriceps',
    dicaCurta: 'Pés na plataforma; amplitude controlada'
  },
  {
    id: 'cadeira-extensora',
    nome: 'Cadeira extensora',
    grupo: 'quadriceps',
    dicaCurta: 'Movimento isolado; contração no topo'
  },

  // POSTERIOR DE COXA (ISQUIOTIBIAIS)
  {
    id: 'terra-romeno',
    nome: 'Levantamento terra romeno (RDL)',
    grupo: 'isquiotibiais',
    dicaCurta: 'Joelhos levemente flexos; quadril para trás'
  },
  {
    id: 'mesa-flexora-sentado',
    nome: 'Mesa flexora sentado',
    grupo: 'isquiotibiais',
    dicaCurta: 'Movimento isolado; amplitude completa'
  },
  {
    id: 'mesa-flexora-deitado',
    nome: 'Mesa flexora deitado',
    grupo: 'isquiotibiais',
    dicaCurta: 'Quadril no banco; movimento controlado'
  },
  {
    id: 'stiff',
    nome: 'Stiff (barra/halteres)',
    grupo: 'isquiotibiais',
    dicaCurta: 'Pernas levemente flexas; movimento do quadril'
  },
  {
    id: 'good-morning',
    nome: 'Good morning (barra)',
    grupo: 'isquiotibiais',
    dicaCurta: 'Joelhos fixos; movimento do quadril'
  },

  // GLÚTEOS
  {
    id: 'hip-thrust',
    nome: 'Elevação de quadril (hip thrust)',
    grupo: 'gluteos',
    dicaCurta: 'Pausa no topo; movimento do quadril'
  },
  {
    id: 'ponte-gluteo',
    nome: 'Ponte de glúteo',
    grupo: 'gluteos',
    dicaCurta: 'Pés firmes; contração no topo'
  },
  {
    id: 'elevacao-posterior-cabo',
    nome: 'Elevação posterior de perna (cabo)',
    grupo: 'gluteos',
    dicaCurta: 'Tronco estável; movimento isolado'
  },
  {
    id: 'cadeira-abdutora',
    nome: 'Cadeira abdutora',
    grupo: 'gluteos',
    dicaCurta: 'Movimento controlado; foque na contração'
  },
  {
    id: 'agachamento-bulgaro',
    nome: 'Agachamento búlgaro',
    grupo: 'gluteos',
    dicaCurta: 'Instabilidade controlada; amplitude completa'
  },

  // PANTURRILHAS
  {
    id: 'panturrilha-em-pe',
    nome: 'Panturrilha em pé',
    grupo: 'panturrilhas',
    dicaCurta: 'Amplitude completa; pausa no topo'
  },
  {
    id: 'panturrilha-sentado',
    nome: 'Panturrilha sentado',
    grupo: 'panturrilhas',
    dicaCurta: 'Joelhos flexionados; movimento isolado'
  },
  {
    id: 'panturrilha-leg-press',
    nome: 'Panturrilha no leg press',
    grupo: 'panturrilhas',
    dicaCurta: 'Pernas estendidas; movimento controlado'
  },

  // BÍCEPS
  {
    id: 'rosca-direta-barra',
    nome: 'Rosca direta (barra)',
    grupo: 'biceps',
    dicaCurta: 'Cotovelos fixos; movimento isolado'
  },
  {
    id: 'rosca-alternada',
    nome: 'Rosca alternada (halteres)',
    grupo: 'biceps',
    dicaCurta: 'Um braço por vez; supinação completa'
  },
  {
    id: 'rosca-martelo',
    nome: 'Rosca martelo',
    grupo: 'biceps',
    dicaCurta: 'Punhos neutros; movimento isolado'
  },
  {
    id: 'rosca-scott',
    nome: 'Rosca Scott',
    grupo: 'biceps',
    dicaCurta: 'Braços apoiados; amplitude parcial'
  },
  {
    id: 'rosca-cabo',
    nome: 'Rosca no cabo',
    grupo: 'biceps',
    dicaCurta: 'Resistência constante; movimento controlado'
  },

  // TRÍCEPS
  {
    id: 'triceps-testa',
    nome: 'Tríceps testa (barra EZ/halter)',
    grupo: 'triceps',
    dicaCurta: 'Cotovelos paralelos; amplitude completa'
  },
  {
    id: 'triceps-pulley-corda',
    nome: 'Tríceps pulley (corda)',
    grupo: 'triceps',
    dicaCurta: 'Cotovelos colados; extensão completa'
  },
  {
    id: 'mergulho-triceps',
    nome: 'Mergulho em paralelas (ênfase tríceps)',
    grupo: 'triceps',
    dicaCurta: 'Corpo ereto; cotovelos para trás'
  },
  {
    id: 'triceps-frances',
    nome: 'Tríceps francês (overhead)',
    grupo: 'triceps',
    dicaCurta: 'Cotovelos fixos; movimento isolado'
  },
  {
    id: 'kickback',
    nome: 'Kickback',
    grupo: 'triceps',
    dicaCurta: 'Braço paralelo ao chão; movimento isolado'
  },

  // ANTEBRAÇO
  {
    id: 'rosca-punho-flexao',
    nome: 'Rosca de punho (flexão)',
    grupo: 'antebraco',
    dicaCurta: 'Movimento isolado; repetições altas'
  },
  {
    id: 'rosca-punho-extensao',
    nome: 'Rosca de punho reversa (extensão)',
    grupo: 'antebraco',
    dicaCurta: 'Pegada pronada; amplitude limitada'
  },
  {
    id: 'farmers-walk',
    nome: 'Farmer\'s walk',
    grupo: 'antebraco',
    dicaCurta: 'Ombros para baixo; passos controlados'
  },
  {
    id: 'hang-barra',
    nome: 'Hang na barra (isométrico)',
    grupo: 'antebraco',
    dicaCurta: 'Ombros ativos; respiração controlada'
  },

  // CORE (ABDÔMEN/OBLÍQUOS/LOMBAR)
  {
    id: 'prancha',
    nome: 'Prancha',
    grupo: 'core',
    dicaCurta: 'Glúteos contraídos; não arquear lombar'
  },
  {
    id: 'prancha-lateral',
    nome: 'Prancha lateral',
    grupo: 'core',
    dicaCurta: 'Quadril elevado; alterne os lados'
  },
  {
    id: 'crunch',
    nome: 'Crunch',
    grupo: 'core',
    dicaCurta: 'Mãos atrás da cabeça; movimento curto'
  },
  {
    id: 'elevacao-pernas',
    nome: 'Elevação de pernas',
    grupo: 'core',
    dicaCurta: 'Joelhos flexionados; movimento controlado'
  },
  {
    id: 'roda-abdominal',
    nome: 'Roda abdominal (ab wheel)',
    grupo: 'core',
    dicaCurta: 'Comece nos joelhos; progressão gradual'
  },
  {
    id: 'cable-crunch',
    nome: 'Cable crunch',
    grupo: 'core',
    dicaCurta: 'Quadril fixo; flexão espinhal'
  },
  {
    id: 'russian-twist',
    nome: 'Russian twist',
    grupo: 'core',
    dicaCurta: 'Pés elevados; tronco inclinado'
  },
  {
    id: 'extensao-lombar',
    nome: 'Extensão lombar (banco romano)',
    grupo: 'core',
    dicaCurta: 'Não hiperextender; foque na lombar'
  },

  // TRAPÉZIO
  {
    id: 'encolhimento-halteres',
    nome: 'Encolhimento (halteres)',
    grupo: 'trapezio',
    dicaCurta: 'Movimento vertical; pausa no topo'
  },
  {
    id: 'encolhimento-barra',
    nome: 'Encolhimento (barra)',
    grupo: 'trapezio',
    dicaCurta: 'Pegada pronada; movimento limpo'
  },

  // COMPOSTOS / OLÍMPICOS
  {
    id: 'power-clean',
    nome: 'Power clean',
    grupo: 'compostos',
    dicaCurta: 'Técnica complexa; progressão gradual'
  },
  {
    id: 'push-press',
    nome: 'Push press',
    grupo: 'compostos',
    dicaCurta: 'Drive das pernas; velocidade na execução'
  },
  {
    id: 'snatch',
    nome: 'Snatch (arranco)',
    grupo: 'compostos',
    dicaCurta: 'Técnica muito complexa; requer treinamento'
  },
  {
    id: 'clean-jerk',
    nome: 'Clean & jerk',
    grupo: 'compostos',
    dicaCurta: 'Dominar cada fase; coordenação total'
  },

  // CONDICIONAMENTO
  {
    id: 'remo-ergometro',
    nome: 'Remo ergômetro',
    grupo: 'cardio',
    dicaCurta: 'Técnica do remo; breathing pattern'
  },
  {
    id: 'air-bike',
    nome: 'Air bike / Assault bike',
    grupo: 'cardio',
    dicaCurta: 'Corpo inteiro; alta intensidade'
  },
  {
    id: 'esteira-corrida',
    nome: 'Esteira (corrida)',
    grupo: 'cardio',
    dicaCurta: 'Comece devagar; aumente gradualmente'
  },
  {
    id: 'escada-ergometrica',
    nome: 'Escada ergométrica',
    grupo: 'cardio',
    dicaCurta: 'Movimento natural; não se apoie muito'
  }
];

export const seedPlanExercises: PlanExercise[] = [
  // Push Day
  {
    id: 'push-1',
    planId: 'ppl-push',
    exerciseId: 'supino-reto',
    series: 4,
    reps: '8-10',
    pesoInicial: 60,
    restSeg: 90
  },
  {
    id: 'push-2',
    planId: 'ppl-push',
    exerciseId: 'supino-inclinado',
    series: 3,
    reps: '10-12',
    pesoInicial: 50,
    restSeg: 90
  },
  {
    id: 'push-3',
    planId: 'ppl-push',
    exerciseId: 'mergulho',
    series: 3,
    reps: 'AMRAP',
    pesoInicial: 0,
    restSeg: 120
  },
  {
    id: 'push-4',
    planId: 'ppl-push',
    exerciseId: 'triceps-testa',
    series: 3,
    reps: '12',
    pesoInicial: 20,
    restSeg: 60
  },
  
  // Pull Day
  {
    id: 'pull-1',
    planId: 'ppl-pull',
    exerciseId: 'barra-fixa',
    series: 4,
    reps: '6-8',
    pesoInicial: 0,
    restSeg: 120
  },
  {
    id: 'pull-2',
    planId: 'ppl-pull',
    exerciseId: 'remada-curvada',
    series: 4,
    reps: '8-10',
    pesoInicial: 50,
    restSeg: 90
  }
];

export const seedSessions: Session[] = [
  {
    id: 'session-1',
    date: '2025-01-08',
    planId: 'ppl-push',
    duracaoMin: 45,
    kcalEstimadas: 320,
    playlistName: 'Push Power Mix'
  },
  {
    id: 'session-2',
    date: '2025-01-06',
    planId: 'ppl-pull',
    duracaoMin: 50,
    kcalEstimadas: 340,
    playlistName: 'Pull Intensity'
  },
  {
    id: 'session-3',
    date: '2025-01-04',
    planId: 'ppl-legs',
    duracaoMin: 55,
    kcalEstimadas: 380,
    playlistName: 'Leg Destroyer'
  }
];

export const seedVibeLog: VibeLog[] = [
  {
    id: 'vibe-1',
    date: '2025-01-08',
    humor: 8,
    fadiga: 4,
    motivacao: 9,
    observacao: 'Ótimo treino, me senti forte!'
  },
  {
    id: 'vibe-2',
    date: '2025-01-06',
    humor: 7,
    fadiga: 6,
    motivacao: 8,
    observacao: 'Cansado mas motivado'
  },
  {
    id: 'vibe-3',
    date: '2025-01-04',
    humor: 6,
    fadiga: 8,
    motivacao: 7,
    observacao: 'Pernas pesadas, mas terminei'
  }
];

export const seedAIChat: AIChat[] = [
  {
    id: 'chat-1',
    date: '2025-01-07',
    pergunta: 'Tenho uma leve dor no ombro direito, o que fazer?',
    resposta: 'Vou adaptar seu treino push para evitar sobrecarga no ombro. Substituí o desenvolvimento por elevações laterais leves e reduzi o peso em 20%. Se a dor persistir, consulte um fisioterapeuta.',
    tags: ['ombro', 'dor', 'adaptacao']
  }
];

export const seedProgressMetric: ProgressMetric[] = [
  {
    id: 'progress-1',
    semanaISO: '2025-W01',
    totalVolume: 12500,
    bestLiftsJSON: JSON.stringify({
      'supino-reto': 62.5,
      'barra-fixa': 8,
      'remada-curvada': 52.5
    }),
    streakAtual: 5
  }
];

// Initialize seed data in localStorage
export function initializeSeedData(): void {
  const keys = {
    'bora_user_profile': seedUserProfile,
    'bora_plans': seedPlans,
    'bora_exercises': seedExercises,
    'bora_plan_exercises': seedPlanExercises,
    'bora_sessions': seedSessions,
    'bora_vibe_log': seedVibeLog,
    'bora_ai_chat': seedAIChat,
    'bora_progress': seedProgressMetric
  };

  Object.entries(keys).forEach(([key, data]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  });

  // Initialize history with sample data
  if (!localStorage.getItem('bora_hist_v1')) {
    const sampleHistory = [
      {
        ts: '2025-01-08T10:00:00.000Z',
        user: 'demo',
        focus: 'Push Power',
        items: [
          { name: 'supino-reto', carga: 62.5, rpe: 8, nota: 'Senti forte hoje!' },
          { name: 'supino-inclinado', carga: 52.5, rpe: 7, nota: 'Boa amplitude' },
          { name: 'mergulho', carga: 0, rpe: 9, nota: '12 reps na última série' }
        ]
      },
      {
        ts: '2025-01-06T15:30:00.000Z',
        user: 'demo',
        focus: 'Pull Domination',
        items: [
          { name: 'barra-fixa', carga: 0, rpe: 8, nota: '8 reps limpas' },
          { name: 'remada-curvada', carga: 50, rpe: 7, nota: 'Boa conexão mente-músculo' }
        ]
      }
    ];
    localStorage.setItem('bora_hist_v1', JSON.stringify(sampleHistory));
  }

  // Initialize XP and streak
  if (!localStorage.getItem('bora_xp_v1')) {
    localStorage.setItem('bora_xp_v1', JSON.stringify({
      currentXP: 75,
      level: 3
    }));
  }

  if (!localStorage.getItem('bora_streak_v1')) {
    localStorage.setItem('bora_streak_v1', JSON.stringify({
      streak: 5,
      lastWorkout: '2025-01-08'
    }));
  }

  console.log('✅ Seed data initialized successfully');
}