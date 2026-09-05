import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { PLAYER_1, PLAYER_2, ROWS } from '@/features/game/constants.js';
import { GAME_STATUS } from '@/features/game/game.js';
import { useGame } from './useGame.js';

// Secuencia que gana el jugador 1 en la fila inferior (jugadas alternadas)
const PLAYER_1_WIN_MOVES = [0, 6, 1, 6, 2, 6, 3];

// Aplica varias jugadas una a una (cada una con su propio render)
function playMoves(result, moves) {
  for (const column of moves) {
    act(() => {
      result.current.makeMove(column);
    });
  }
}

// Pruebas del hook de partida
describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('arranca en modo local con el tablero vacío y marcador a cero', () => {
    const { result } = renderHook(() => useGame({ mode: 'local' }));
    expect(result.current.game.turn).toBe(PLAYER_1);
    expect(result.current.game.status).toBe(GAME_STATUS.PLAYING);
    expect(result.current.scores).toEqual({ [PLAYER_1]: 0, [PLAYER_2]: 0 });
  });

  it('aplica la jugada y alterna el turno', () => {
    const { result } = renderHook(() => useGame({ mode: 'local' }));
    act(() => {
      result.current.makeMove(3);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
    expect(result.current.game.board[ROWS - 1][3]).toBe(PLAYER_1);
  });

  it('el bot responde tras el retraso en modo bot', () => {
    const { result } = renderHook(() => useGame({ mode: 'bot', botDifficulty: 'facil' }));
    act(() => {
      result.current.makeMove(3);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.game.turn).toBe(PLAYER_1);
  });

  it('suma un punto al ganador cuando termina la partida', () => {
    const { result } = renderHook(() => useGame({ mode: 'local' }));
    playMoves(result, PLAYER_1_WIN_MOVES);
    expect(result.current.game.status).toBe(GAME_STATUS.WON);
    expect(result.current.game.winner).toBe(PLAYER_1);
    expect(result.current.scores[PLAYER_1]).toBe(1);
    expect(result.current.scores[PLAYER_2]).toBe(0);
  });

  it('conserva el marcador entre rondas y acumula victorias', () => {
    const { result } = renderHook(() => useGame({ mode: 'local' }));
    playMoves(result, PLAYER_1_WIN_MOVES);
    act(() => {
      result.current.restart();
    });
    expect(result.current.game.status).toBe(GAME_STATUS.PLAYING);
    expect(result.current.game.board.flat().every((cell) => cell === null)).toBe(true);
    expect(result.current.scores[PLAYER_1]).toBe(1);
    playMoves(result, PLAYER_1_WIN_MOVES);
    expect(result.current.scores[PLAYER_1]).toBe(2);
  });

  it('no programa al bot fuera del modo bot', () => {
    const { result } = renderHook(() => useGame({ mode: 'local' }));
    act(() => {
      result.current.makeMove(0);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.game.turn).toBe(PLAYER_2);
  });
});
