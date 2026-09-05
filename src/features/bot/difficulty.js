// Niveles de dificultad del bot
export const DIFFICULTIES = ['facil', 'medio', 'dificil'];

export const DIFFICULTY_LABELS = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
};

// Profundidad de búsqueda minimax por nivel (fácil es codicioso)
export const DIFFICULTY_DEPTHS = {
  facil: 1,
  medio: 3,
  dificil: 5,
};

export const DEFAULT_DIFFICULTY = 'dificil';
