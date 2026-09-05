import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { COLUMNS, PLAYER_1, PLAYER_2, ROWS } from '@/features/game/constants.js';
import { createBoard } from '@/features/game/board.js';
import Board from './Board.jsx';

// Rellena una celda del tablero para las pruebas
function boardWith(cells) {
    const board = createBoard();
    for (const { row, col, player } of cells) {
        board[row][col] = player;
    }
    return board;
}

// Pruebas del tablero interactivo
describe('Board', () => {
    it('muestra un botón por cada columna', () => {
        render(<Board board={createBoard()} onDrop={() => {}} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(COLUMNS);
    });

    it('suelta la bolita en la columna pulsada', async () => {
        const user = userEvent.setup();
        const onDrop = vi.fn();
        render(<Board board={createBoard()} onDrop={onDrop} />);
        await user.click(screen.getByRole('button', { name: 'Columna 4' }));
        expect(onDrop).toHaveBeenCalledWith(3);
    });

    it('deshabilita la columna cuando está llena', () => {
        const board = createBoard();
        for (let row = 0; row < ROWS; row += 1) {
            board[row][0] = PLAYER_1;
        }
        render(<Board board={board} onDrop={() => {}} />);
        expect(screen.getByRole('button', { name: 'Columna 1' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Columna 2' })).toBeEnabled();
    });

    it('deshabilita todas las columnas cuando el tablero no es interactivo', () => {
        render(<Board board={createBoard()} disabled onDrop={() => {}} />);
        for (const button of screen.getAllByRole('button')) {
            expect(button).toBeDisabled();
        }
    });

    it('pinta una bolita por cada celda ocupada con la clase del jugador', () => {
        const board = boardWith([
            { row: ROWS - 1, col: 0, player: PLAYER_1 },
            { row: ROWS - 1, col: 3, player: PLAYER_2 },
            { row: ROWS - 2, col: 0, player: PLAYER_1 },
        ]);
        render(<Board board={board} onDrop={() => {}} />);
        expect(document.querySelectorAll('.board__ball')).toHaveLength(3);
        expect(document.querySelectorAll('.board__ball--player1')).toHaveLength(2);
        expect(document.querySelectorAll('.board__ball--player2')).toHaveLength(1);
    });

    it('resalta las bolitas de la línea ganadora', () => {
        const board = boardWith([
            { row: ROWS - 1, col: 0, player: PLAYER_1 },
            { row: ROWS - 1, col: 1, player: PLAYER_1 },
            { row: ROWS - 1, col: 2, player: PLAYER_1 },
            { row: ROWS - 1, col: 3, player: PLAYER_1 },
        ]);
        const winningLine = [
            { row: ROWS - 1, col: 0 },
            { row: ROWS - 1, col: 1 },
            { row: ROWS - 1, col: 2 },
            { row: ROWS - 1, col: 3 },
        ];
        render(<Board board={board} winningLine={winningLine} onDrop={() => {}} />);
        expect(document.querySelectorAll('.board__ball--winner')).toHaveLength(4);
    });

    it('no dibuja la línea de victoria sin una línea ganadora', () => {
        render(<Board board={createBoard()} winningLine={null} onDrop={() => {}} />);
        expect(document.querySelector('.board__strike')).toBeNull();
    });

    it('tacha la línea ganadora con una línea que cruza el centro de cada bolita', () => {
        const board = boardWith([
            { row: ROWS - 1, col: 0, player: PLAYER_1 },
            { row: ROWS - 1, col: 1, player: PLAYER_1 },
            { row: ROWS - 1, col: 2, player: PLAYER_1 },
            { row: ROWS - 1, col: 3, player: PLAYER_1 },
        ]);
        const winningLine = [
            { row: ROWS - 1, col: 0 },
            { row: ROWS - 1, col: 1 },
            { row: ROWS - 1, col: 2 },
            { row: ROWS - 1, col: 3 },
        ];
        render(<Board board={board} winningLine={winningLine} onDrop={() => {}} />);
        const strike = document.querySelector('.board__strike');
        const segment = strike.querySelector('line');
        // horizontal por la fila inferior: y fijo en el centro (5.5) y x desde
        // el borde de la primera bolita (0) hasta el borde de la última (4)
        expect(segment.getAttribute('y1')).toBe('5.5');
        expect(segment.getAttribute('y2')).toBe('5.5');
        expect(segment.getAttribute('x1')).toBe('0');
        expect(segment.getAttribute('x2')).toBe('4');
    });

    it('tacha una diagonal ganadora de extremo a extremo', () => {
        const board = boardWith([
            { row: 2, col: 0, player: PLAYER_1 },
            { row: 3, col: 1, player: PLAYER_1 },
            { row: 4, col: 2, player: PLAYER_1 },
            { row: 5, col: 3, player: PLAYER_1 },
        ]);
        const winningLine = [
            { row: 2, col: 0 },
            { row: 3, col: 1 },
            { row: 4, col: 2 },
            { row: 5, col: 3 },
        ];
        render(<Board board={board} winningLine={winningLine} onDrop={() => {}} />);
        const segment = document.querySelector('.board__strike line');
        expect(segment.getAttribute('x1')).toBe('0');
        expect(segment.getAttribute('y1')).toBe('2');
        expect(segment.getAttribute('x2')).toBe('4');
        expect(segment.getAttribute('y2')).toBe('6');
    });
});
