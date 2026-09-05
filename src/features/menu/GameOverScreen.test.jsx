import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameOverScreen from './GameOverScreen.jsx';

// Pruebas de la pantalla de fin de partida
describe('GameOverScreen', () => {
    it('muestra el título del resultado', () => {
        render(<GameOverScreen title="¡Ganaste!" onRestart={() => {}} onMenu={() => {}} />);
        expect(screen.getByRole('heading', { name: '¡Ganaste!' })).toBeInTheDocument();
    });

    it('avisa al reiniciar la partida', async () => {
        const user = userEvent.setup();
        const onRestart = vi.fn();
        render(<GameOverScreen title="Empate" onRestart={onRestart} onMenu={() => {}} />);
        await user.click(screen.getByRole('button', { name: /jugar de nuevo/i }));
        expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('avisa al volver al menú', async () => {
        const user = userEvent.setup();
        const onMenu = vi.fn();
        render(<GameOverScreen title="Empate" onRestart={() => {}} onMenu={onMenu} />);
        await user.click(screen.getByRole('button', { name: /menú/i }));
        expect(onMenu).toHaveBeenCalledTimes(1);
    });
});
