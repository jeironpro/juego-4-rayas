import { COLUMNS, PLAYER_1, PLAYER_2, WIN_LENGTH } from '@/features/game/constants.js';
import { getLowestEmptyRow } from '@/features/game/board.js';
import { applyMove, GAME_STATUS } from '@/features/game/game.js';
import { DIFFICULTY_DEPTHS } from './difficulty.js';

// Puntuación que representa una victoria o derrota segura (domina la heurística)
const WIN_SCORE = 1_000_000;

// Valor de una ventana según cuántas bolitas propias contiene
const WINDOW_SCORES = [0, 1, 10, 100, 1_000];

// Bonificación por proximidad al centro de cada columna
const CENTER_BONUS = [0, 1, 2, 3, 2, 1, 0];

// Devuelve las columnas donde todavía se puede jugar
export function getLegalMoves(board) {
  const moves = [];
  for (let column = 0; column < COLUMNS; column += 1) {
    if (getLowestEmptyRow(board, column) !== -1) {
      moves.push(column);
    }
  }
  return moves;
}

// Agrupa el tablero en todas las ventanas de cuatro celdas alineadas
function getWindows(board) {
  const windows = [];
  const rows = board.length;
  // horizontales
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1) {
      windows.push([0, 1, 2, 3].map((step) => board[row][col + step]));
    }
  }
  // verticales
  for (let col = 0; col < COLUMNS; col += 1) {
    for (let row = 0; row <= rows - WIN_LENGTH; row += 1) {
      windows.push([0, 1, 2, 3].map((step) => board[row + step][col]));
    }
  }
  // diagonales descendentes
  for (let row = 0; row <= rows - WIN_LENGTH; row += 1) {
    for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1) {
      windows.push([0, 1, 2, 3].map((step) => board[row + step][col + step]));
    }
  }
  // diagonales ascendentes
  for (let row = 0; row <= rows - WIN_LENGTH; row += 1) {
    for (let col = WIN_LENGTH - 1; col < COLUMNS; col += 1) {
      windows.push([0, 1, 2, 3].map((step) => board[row + step][col - step]));
    }
  }
  return windows;
}

// Puntúa el tablero desde la perspectiva de un jugador: ventanas de 4 más centro
function evaluate(board, player) {
  const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
  let score = 0;
  for (const window of getWindows(board)) {
    let own = 0;
    let rival = 0;
    for (const cell of window) {
      if (cell === player) own += 1;
      else if (cell === opponent) rival += 1;
    }
    if (own > 0 && rival > 0) continue;
    if (own > 0) score += WINDOW_SCORES[own];
    if (rival > 0) score -= WINDOW_SCORES[rival];
  }
  // preferencia por el centro: facilita ventanas en ambas direcciones
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      if (board[row][col] === player) score += CENTER_BONUS[col];
      else if (board[row][col] === opponent) score -= CENTER_BONUS[col];
    }
  }
  return score;
}

// Ordena las columnas poniendo primero las del centro (mejora la poda alfa-beta)
function orderMoves(moves) {
  return [...moves].sort((a, b) => CENTER_BONUS[b] - CENTER_BONUS[a]);
}

// Puntúa el resultado inmediato de jugar en una columna
function scoreAfterMove(game, column) {
  const next = applyMove(game, column);
  if (next.status === GAME_STATUS.WON) {
    return next.winner === game.turn ? WIN_SCORE : -WIN_SCORE;
  }
  if (next.status === GAME_STATUS.DRAW) {
    return 0;
  }
  return evaluate(next.board, game.turn);
}

// Búsqueda minimax con poda alfa-beta; el bot maximiza, el rival minimiza
function search(game, botPlayer, depth, alpha, beta) {
  if (game.status === GAME_STATUS.WON) {
    return game.winner === botPlayer ? WIN_SCORE : -WIN_SCORE;
  }
  if (game.status === GAME_STATUS.DRAW) {
    return 0;
  }
  if (depth === 0) {
    return evaluate(game.board, botPlayer);
  }

  const moves = getLegalMoves(game.board);
  if (game.turn === botPlayer) {
    let best = -Infinity;
    for (const column of orderMoves(moves)) {
      const score = search(applyMove(game, column), botPlayer, depth - 1, alpha, beta);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const column of orderMoves(moves)) {
    const score = search(applyMove(game, column), botPlayer, depth - 1, alpha, beta);
    best = Math.min(best, score);
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

// Nivel fácil: elige entre la mejor jugada inmediata y una aleatoria, con sesgo a la mejor
function pickGreedyMove(game, random) {
  const moves = getLegalMoves(game.board);
  const scored = moves.map((column) => ({ column, score: scoreAfterMove(game, column) }));
  const bestScore = Math.max(...scored.map((entry) => entry.score));
  const bestMoves = scored
    .filter((entry) => entry.score === bestScore)
    .map((entry) => entry.column);
  if (random() < 0.7) {
    return bestMoves[Math.floor(random() * bestMoves.length)];
  }
  return moves[Math.floor(random() * moves.length)];
}

// Elige la columna del bot según la dificultad; devuelve null si no hay jugadas legales
export function chooseMove(game, difficulty, random = Math.random) {
  if (game.status !== GAME_STATUS.PLAYING) {
    return null;
  }
  const moves = getLegalMoves(game.board);
  if (moves.length === 0) {
    return null;
  }

  const depth = DIFFICULTY_DEPTHS[difficulty];
  if (depth <= 1) {
    return pickGreedyMove(game, random);
  }

  let bestScore = -Infinity;
  let bestMoves = [];
  for (const column of orderMoves(moves)) {
    const score = search(applyMove(game, column), game.turn, depth - 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [column];
    } else if (score === bestScore) {
      bestMoves.push(column);
    }
  }
  // variedad entre jugadas igualmente buenas
  return bestMoves[Math.floor(random() * bestMoves.length)];
}
