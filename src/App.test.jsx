import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

// Verifica que la aplicación renderiza correctamente
describe('App', () => {
  it('muestra el título del juego', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '4 en Raya' })).toBeInTheDocument();
  });
});
