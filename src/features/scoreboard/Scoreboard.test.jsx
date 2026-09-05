import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PLAYER_1, PLAYER_2 } from '@/features/game/constants.js';
import Scoreboard from './Scoreboard.jsx';

// Pruebas del marcador superior
describe('Scoreboard', () => {
  it('muestra los nombres y contadores de ambos jugadores', () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Score={3}
        player2Score={1}
        turn={PLAYER_1}
      />,
    );
    const region = screen.getByRole('region', { name: 'Marcador de la partida' });
    expect(region).toHaveTextContent('TÚ');
    expect(region).toHaveTextContent('BOT');
    expect(region).toHaveTextContent('vs');
    expect(region).toHaveTextContent('3');
    expect(region).toHaveTextContent('1');
  });

  it('resalta al jugador en turno', () => {
    const { rerender } = render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Score={0}
        player2Score={0}
        turn={PLAYER_1}
      />,
    );
    expect(screen.getByText('TÚ').className).toContain('scoreboard__name--active');
    expect(screen.getByText('BOT').className).not.toContain('scoreboard__name--active');
    rerender(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Score={0}
        player2Score={0}
        turn={PLAYER_2}
      />,
    );
    expect(screen.getByText('BOT').className).toContain('scoreboard__name--active');
    expect(screen.getByText('TÚ').className).not.toContain('scoreboard__name--active');
  });

  it('muestra la insignia de dificultad cuando se indica', () => {
    render(
      <Scoreboard
        player1Name="TÚ"
        player2Name="BOT"
        player1Score={0}
        player2Score={0}
        badge="Difícil"
        turn={PLAYER_1}
      />,
    );
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });
});
