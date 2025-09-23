// Exercise execution hints and tips

export interface ExerciseHint {
  exercise: string;
  tips: string[];
  focus: string;
  common_mistakes: string[];
}

export const exerciseHints: Record<string, ExerciseHint> = {
  'supino reto': {
    exercise: 'Supino Reto',
    tips: [
      'Pés firmes; escápulas retraídas; barra na linha do mamilo',
      'Caminho em "J"; ritmo 2-0-2',
      'Agachamento: bracing; joelhos acompanham os pés; olhar estável',
      'Descer controlado; subir potente',
      'Remada curvada: coluna neutra; cotovelos para trás',
      'Pausa na contração; evitar embalo'
    ],
    focus: 'Peito, tríceps anterior',
    common_mistakes: [
      'Barra muito alta no peito',
      'Perder a tensão na descida',
      'Pés instáveis'
    ]
  },
  'supino inclinado': {
    exercise: 'Supino Inclinado',
    tips: [
      'Inclinação de 30-45 graus',
      'Foque na porção superior do peito',
      'Mantenha os ombros para trás',
      'Amplitude completa'
    ],
    focus: 'Peito superior, deltoides anterior',
    common_mistakes: [
      'Inclinação muito alta (vira ombro)',
      'Arco excessivo nas costas',
      'Amplitude parcial'
    ]
  },
  'mergulho': {
    exercise: 'Mergulho',
    tips: [
      'Incline o tronco para frente',
      'Cotovelos próximos ao corpo',
      'Desça até sentir alongamento',
      'Controle total do movimento'
    ],
    focus: 'Peito inferior, tríceps',
    common_mistakes: [
      'Corpo muito vertical (só tríceps)',
      'Amplitude muito pequena',
      'Velocidade excessiva'
    ]
  },
  'tríceps testa': {
    exercise: 'Tríceps Testa',
    tips: [
      'Cotovelos fixos e paralelos',
      'Movimento apenas do antebraço',
      'Controle na fase excêntrica',
      'Não deixe os cotovelos abrirem'
    ],
    focus: 'Tríceps (cabeça longa)',
    common_mistakes: [
      'Cotovelos se movendo',
      'Abertura dos cotovelos',
      'Amplitude parcial'
    ]
  },
  'tríceps pulley': {
    exercise: 'Tríceps Pulley',
    tips: [
      'Cotovelos colados no corpo',
      'Extensão completa',
      'Contração no final do movimento',
      'Controle na volta'
    ],
    focus: 'Tríceps (cabeça lateral)',
    common_mistakes: [
      'Cotovelos saindo do corpo',
      'Usar o corpo para ajudar',
      'Não estender completamente'
    ]
  }
};

export function getHintForExercise(exerciseName: string | null): ExerciseHint | null {
  if (!exerciseName) return null;
  
  const key = exerciseName.toLowerCase().trim();
  return exerciseHints[key] || null;
}