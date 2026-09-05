import { useCallback, useEffect, useRef, useState } from 'react';
import { createGame, applyMove, GAME_STATUS } from '@/features/game/game.js';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { chooseMove } from '@/features/bot/bot.js';

// Pausa antes de la jugada del bot para que se aprecie su turno
const BOT_DELAY_MS = 700;

// Estado de una partida contra el bot (mode 'bot') o entre dos jugadores (mode 'local').
// El bot es siempre el jugador 2 y responde tras un retraso cuando es su turno.
export function useGame({ mode = 'local', botDifficulty = null } = {}) {
    const [game, setGame] = useState(() => createGame());
    const [scores, setScores] = useState({ [PLAYER_1]: 0, [PLAYER_2]: 0 });
    const gameRef = useRef(game);
    const botTimerRef = useRef(null);

    // Mantiene la partida más reciente accesible desde callbacks sin estados obsoletos
    useEffect(() => {
        gameRef.current = game;
    });

    // Aplica el resultado de una jugada y suma el punto si hubo ganador
    const applyResult = useCallback((next) => {
        setGame(next);
        if (next.status === GAME_STATUS.WON) {
            setScores((current) => ({
                ...current,
                [next.winner]: current[next.winner] + 1,
            }));
        }
    }, []);

    // Jugada de un humano (o del segundo jugador en modo local)
    const makeMove = useCallback(
        (column) => {
            const current = gameRef.current;
            if (current.status !== GAME_STATUS.PLAYING) {
                return;
            }
            applyResult(applyMove(current, column));
        },
        [applyResult],
    );

    // Programa la jugada del bot cuando le toca; se cancela si cambia el estado
    useEffect(() => {
        if (mode !== 'bot' || botDifficulty === null) {
            return undefined;
        }
        const current = gameRef.current;
        if (current.status !== GAME_STATUS.PLAYING || current.turn !== PLAYER_2) {
            return undefined;
        }
        if (botTimerRef.current !== null) {
            return undefined;
        }
        botTimerRef.current = setTimeout(() => {
            botTimerRef.current = null;
            const latest = gameRef.current;
            const move = chooseMove(latest, botDifficulty);
            if (move !== null) {
                applyResult(applyMove(latest, move));
            }
        }, BOT_DELAY_MS);
        return () => {
            if (botTimerRef.current !== null) {
                clearTimeout(botTimerRef.current);
                botTimerRef.current = null;
            }
        };
    }, [game, mode, botDifficulty, applyResult]);

    // Nueva ronda: reinicia el tablero y conserva el marcador acumulado
    const restart = useCallback(() => {
        setGame(createGame());
    }, []);

    return { game, scores, makeMove, restart };
}
