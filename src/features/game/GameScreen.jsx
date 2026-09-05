import Button from '@/components/ui/Button.jsx';
import Scoreboard from '@/features/scoreboard/Scoreboard.jsx';
import Board from '@/features/board/Board.jsx';
import GameOverScreen from '@/features/menu/GameOverScreen.jsx';
import { useGame } from '@/hooks/useGame.js';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import { GAME_STATUS } from '@/features/game/game.js';
import { DIFFICULTY_LABELS } from '@/features/bot/difficulty.js';
import './GameScreen.css';

// Pantalla de partida: marcador arriba, tablero al centro y acciones debajo.
// En modo bot el tablero se bloquea mientras el jugador 2 (bot) piensa su jugada.
function GameScreen({ mode, difficulty, onMenu }) {
    const { game, scores, makeMove, restart } = useGame({ mode, botDifficulty: difficulty });
    const isBotMode = mode === 'bot';
    const player1Name = isBotMode ? 'TÚ' : 'JUGADOR 1';
    const player2Name = isBotMode ? 'BOT' : 'JUGADOR 2';
    const badge = isBotMode ? DIFFICULTY_LABELS[difficulty] : null;
    const botTurn = isBotMode && game.turn === PLAYER_2 && game.status === GAME_STATUS.PLAYING;
    const gameOver = game.status !== GAME_STATUS.PLAYING;

    const overTitle = (() => {
        if (game.status === GAME_STATUS.DRAW) {
            return 'Empate';
        }
        if (isBotMode) {
            return game.winner === PLAYER_1 ? '¡Ganaste!' : '¡El bot ganó!';
        }
        return `¡${game.winner === PLAYER_1 ? player1Name : player2Name} gana!`;
    })();

    return (
        <div className="game-screen">
            <Scoreboard
                player1Name={player1Name}
                player2Name={player2Name}
                player1Score={scores[PLAYER_1]}
                player2Score={scores[PLAYER_2]}
                badge={badge}
                turn={game.turn}
            />
            <Board
                board={game.board}
                winningLine={game.winningLine}
                disabled={gameOver || botTurn}
                onDrop={makeMove}
            />
            <div className="game-screen__status" role="status">
                {botTurn ? 'El bot está pensando…' : ''}
            </div>
            <div className="game-screen__actions">
                <Button variant="secondary" icon="restart_alt" onClick={restart}>
                    Reiniciar
                </Button>
                <Button variant="secondary" icon="arrow_back" onClick={onMenu}>
                    Menú
                </Button>
            </div>
            {gameOver && <GameOverScreen title={overTitle} onRestart={restart} onMenu={onMenu} />}
        </div>
    );
}

export default GameScreen;
