import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeScreen from './HomeScreen.jsx';

// Pruebas de la pantalla de inicio
describe('HomeScreen', () => {
    it('muestra el título y las opciones de modo', () => {
        render(<HomeScreen onStart={() => {}} />);
        expect(screen.getByRole('heading', { name: '4 en Raya' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /jugar vs bot/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /2 jugadores/i })).toBeInTheDocument();
    });

    it('muestra la dificultad al elegir jugar contra el bot', async () => {
        const user = userEvent.setup();
        render(<HomeScreen onStart={() => {}} />);
        expect(screen.queryByRole('group', { name: 'Dificultad del bot' })).not.toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /jugar vs bot/i }));
        expect(screen.getByRole('group', { name: 'Dificultad del bot' })).toBeInTheDocument();
    });

    it('arranca la partida con el modo y la dificultad elegidos', async () => {
        const user = userEvent.setup();
        const onStart = vi.fn();
        render(<HomeScreen onStart={onStart} />);
        await user.click(screen.getByRole('button', { name: /jugar vs bot/i }));
        await user.click(screen.getByRole('button', { name: 'Medio' }));
        await user.click(screen.getByRole('button', { name: 'Jugar' }));
        expect(onStart).toHaveBeenCalledWith('bot', 'medio');
    });

    it('no arranca la partida sin elegir un modo', async () => {
        const user = userEvent.setup();
        const onStart = vi.fn();
        render(<HomeScreen onStart={onStart} />);
        await user.click(screen.getByRole('button', { name: 'Jugar' }));
        expect(onStart).not.toHaveBeenCalled();
    });
});
