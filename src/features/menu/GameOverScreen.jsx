import Button from '@/components/ui/Button.jsx';
import './GameOverScreen.css';

// Superposición de fin de partida: título del resultado y acciones para continuar
function GameOverScreen({ title, onRestart, onMenu }) {
  return (
    <div className="game-over" role="dialog" aria-modal="true" aria-label="Fin de la partida">
      <div className="game-over__card">
        <h2 className="game-over__title">{title}</h2>
        <div className="game-over__actions">
          <Button icon="replay" onClick={onRestart}>
            Jugar de nuevo
          </Button>
          <Button variant="secondary" icon="arrow_back" onClick={onMenu}>
            Menú
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GameOverScreen;
