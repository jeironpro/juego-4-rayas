import {
    COLUMNS,
    EMPTY,
    PLAYER_1,
    PLAYER_2,
    ROWS,
    WIN_LENGTH,
    DIRECTIONS,
} from '@/features/game/constants.js';
import { getLowestEmptyRow, isBoardFull } from '@/features/game/board.js';
import { GAME_STATUS } from '@/features/game/game.js';
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

// Devuelve el rival del jugador indicado
function getOpponent(player) {
    return player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
}

// Coordenadas de todas las ventanas de cuatro celdas alineadas, calculadas una
// sola vez para que la evaluación no las reconstruya en cada hoja de la búsqueda
function buildWindowCoords() {
    const coords = [];
    // horizontales
    for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1) {
            coords.push([0, 1, 2, 3].map((step) => [row, col + step]));
        }
    }
    // verticales
    for (let col = 0; col < COLUMNS; col += 1) {
        for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1) {
            coords.push([0, 1, 2, 3].map((step) => [row + step, col]));
        }
    }
    // diagonales descendentes
    for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1) {
        for (let col = 0; col <= COLUMNS - WIN_LENGTH; col += 1) {
            coords.push([0, 1, 2, 3].map((step) => [row + step, col + step]));
        }
    }
    // diagonales ascendentes
    for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1) {
        for (let col = WIN_LENGTH - 1; col < COLUMNS; col += 1) {
            coords.push([0, 1, 2, 3].map((step) => [row + step, col - step]));
        }
    }
    return coords;
}

const WINDOW_COORDS = buildWindowCoords();

// Puntúa el tablero desde la perspectiva de un jugador: ventanas de 4 más centro
function evaluateBoard(board, player) {
    const opponent = getOpponent(player);
    let score = 0;
    for (const window of WINDOW_COORDS) {
        let own = 0;
        let rival = 0;
        for (const [row, col] of window) {
            if (board[row][col] === player) own += 1;
            else if (board[row][col] === opponent) rival += 1;
        }
        if (own > 0 && rival > 0) continue;
        if (own > 0) score += WINDOW_SCORES[own];
        if (rival > 0) score -= WINDOW_SCORES[rival];
    }
    // preferencia por el centro: facilita ventanas en ambas direcciones
    for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLUMNS; col += 1) {
            if (board[row][col] === player) score += CENTER_BONUS[col];
            else if (board[row][col] === opponent) score -= CENTER_BONUS[col];
        }
    }
    return score;
}

// Coloca una bolita en la columna y devuelve la fila donde cayó (-1 si está llena)
function placeDisk(board, column, player) {
    const row = getLowestEmptyRow(board, column);
    if (row === -1) {
        return -1;
    }
    board[row][column] = player;
    return row;
}

// Retira la bolita de la celda indicada (deshace una jugada de la búsqueda)
function removeDisk(board, row, column) {
    board[row][column] = EMPTY;
}

// Comprueba si la bolita recién colocada completa 4 en raya
function isWinningMove(board, row, column, player) {
    for (const { row: rowStep, col: colStep } of DIRECTIONS) {
        let count = 1;
        for (const sign of [1, -1]) {
            let nextRow = row + rowStep * sign;
            let nextCol = column + colStep * sign;
            while (
                nextRow >= 0 &&
                nextRow < ROWS &&
                nextCol >= 0 &&
                nextCol < COLUMNS &&
                board[nextRow][nextCol] === player
            ) {
                count += 1;
                nextRow += rowStep * sign;
                nextCol += colStep * sign;
            }
        }
        if (count >= WIN_LENGTH) {
            return true;
        }
    }
    return false;
}

// Devuelve la primera columna donde el jugador completaría 4 en raya, o null
function findImmediateWinColumn(board, player) {
    for (const column of getLegalMoves(board)) {
        const row = placeDisk(board, column, player);
        const wins = isWinningMove(board, row, column, player);
        removeDisk(board, row, column);
        if (wins) {
            return column;
        }
    }
    return null;
}

// Devuelve las columnas donde el rival ganaría si jugara ahora (amenazas a tapar)
function getThreatColumns(board, player) {
    const threats = [];
    for (const column of getLegalMoves(board)) {
        const row = placeDisk(board, column, player);
        if (isWinningMove(board, row, column, player)) {
            threats.push(column);
        }
        removeDisk(board, row, column);
    }
    return threats;
}

// Ordena las jugadas: primero tapar las amenazas del rival y luego el centro
function orderMoves(moves, threats) {
    const threatSet = new Set(threats);
    return [...moves].sort(
        (a, b) =>
            Number(threatSet.has(b)) - Number(threatSet.has(a)) ||
            CENTER_BONUS[b] - CENTER_BONUS[a] ||
            a - b,
    );
}

// Búsqueda negamax con poda alfa-beta sobre el tablero (jugadas en sitio con
// deshacer). El valor devuelto siempre se expresa desde la perspectiva del
// jugador al que le toca mover
function negamax(board, player, depth, alpha, beta) {
    // si hay una jugada ganadora ya no hace falta explorar el resto del árbol
    if (findImmediateWinColumn(board, player) !== null) {
        return WIN_SCORE - 1;
    }
    const moves = getLegalMoves(board);
    if (moves.length === 0) {
        return 0; // tablero lleno: empate
    }
    if (depth === 0) {
        return evaluateBoard(board, player);
    }

    // el rival taparía estas columnas para evitar que ganemos, así que conviene
    // explorarlas primero (mejora la poda alfa-beta)
    const orderedMoves = orderMoves(moves, getThreatColumns(board, getOpponent(player)));
    let best = -Infinity;
    for (const column of orderedMoves) {
        const row = placeDisk(board, column, player);
        const value = -negamax(board, getOpponent(player), depth - 1, -beta, -alpha);
        removeDisk(board, row, column);

        best = Math.max(best, value);
        alpha = Math.max(alpha, value);
        if (alpha >= beta) {
            break;
        }
    }
    return best;
}

// Puntúa el resultado inmediato de jugar en una columna (para el nivel fácil)
function scoreAfterPlace(board, column, player) {
    const row = placeDisk(board, column, player);
    let score;
    if (isWinningMove(board, row, column, player)) {
        score = WIN_SCORE;
    } else if (row === 0 && isBoardFull(board)) {
        score = 0;
    } else {
        score = evaluateBoard(board, player);
    }
    removeDisk(board, row, column);
    return score;
}

// Nivel fácil: elige entre la mejor jugada inmediata y una aleatoria, con sesgo a la mejor
function pickGreedyMove(game, random) {
    const moves = getLegalMoves(game.board);
    const scored = moves.map((column) => ({
        column,
        score: scoreAfterPlace(game.board, column, game.turn),
    }));
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

    const bot = game.turn;
    // victoria inmediata: se juega sin necesidad de buscar
    const winningColumn = findImmediateWinColumn(game.board, bot);
    if (winningColumn !== null) {
        return winningColumn;
    }

    const orderedMoves = orderMoves(moves, getThreatColumns(game.board, getOpponent(bot)));
    let bestScore = -Infinity;
    let bestMoves = [];
    for (const column of orderedMoves) {
        const row = placeDisk(game.board, column, bot);
        const value = -negamax(game.board, getOpponent(bot), depth - 1, -Infinity, Infinity);
        removeDisk(game.board, row, column);

        if (value > bestScore) {
            bestScore = value;
            bestMoves = [column];
        } else if (value === bestScore) {
            bestMoves.push(column);
        }
        // si la columna fuerza una victoria no se puede mejorar con otra jugada
        if (value >= WIN_SCORE - 1) {
            break;
        }
    }
    // variedad entre jugadas igualmente buenas
    return bestMoves[Math.floor(random() * bestMoves.length)];
}
