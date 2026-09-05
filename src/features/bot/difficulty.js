// Niveles de dificultad del bot
export const DIFFICULTIES = ['facil', 'medio', 'dificil'];

export const DIFFICULTY_LABELS = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
};

// Profundidad de búsqueda negamax por nivel (fácil es codicioso y el medio
// busca unas pocas jugadas; difícil explora el tablero casi por completo)
export const DIFFICULTY_DEPTHS = {
  facil: 1,
  medio: 5,
  dificil: 8,
};

export const DEFAULT_DIFFICULTY = 'dificil';
