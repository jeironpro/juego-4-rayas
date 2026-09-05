import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameScreen from './GameScreen.jsx';

// Pruebas de la pantalla de partida (modo local, sin bot)
describe('GameScreen', () => {
    it('muestra el marcador con los nombres de ambos jugadores', () => {
        render(<GameScreen mode="local" difficulty="dificil" onMenu={() => {}} />);
        const region = screen.getByRole('region', { name: 'Marcador de la partida' });
        expect(region).toHaveTextContent('JUGADOR 1');
        expect(region).toHaveTextContent('JUGADOR 2');
        expect(screen.getByRole('button', { name: 'Reiniciar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /menú/i })).toBeInTheDocument();
    });

    it('suelta bolitas al pulsar las columnas y pasa el turno', async () => {
        const user = userEvent.setup();
        render(<GameScreen mode="local" difficulty="dificil" onMenu={() => {}} />);
        await user.click(screen.getByRole('button', { name: 'Columna 4' }));
        expect(document.querySelectorAll('.board__ball')).toHaveLength(1);
        // el turno pasa al jugador 2 (su nombre queda activo en el marcador)
        expect(screen.getByText('JUGADOR 2').className).toContain('scoreboard__name--active');
    });

    it('avisa al salir al menú', async () => {
        const user = userEvent.setup();
        const onMenu = vi.fn();
        render(<GameScreen mode="local" difficulty="dificil" onMenu={onMenu} />);
        await user.click(screen.getByRole('button', { name: /menú/i }));
        expect(onMenu).toHaveBeenCalledTimes(1);
    });

    it('muestra la superposición de fin de partida al completar cuatro en raya', async () => {
        const user = userEvent.setup();
        render(<GameScreen mode="local" difficulty="dificil" onMenu={() => {}} />);
        // El jugador 1 gana en la fila inferior (0-3) mientras el 2 juega en la columna 7
        const moves = [0, 6, 1, 6, 2, 6, 3];
        for (const column of moves) {
            await user.click(screen.getByRole('button', { name: `Columna ${column + 1}` }));
        }
        expect(screen.getByRole('dialog', { name: 'Fin de la partida' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: '¡JUGADOR 1 gana!' })).toBeInTheDocument();
    });
});
