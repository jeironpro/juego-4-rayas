// Bolita de un jugador: anclada a su celda del tablero; expone la fila como
// propiedad CSS para que la animación de caída conozca la distancia recorrida
function Ball({ player, winning, row, col }) {
  const className = ['board__ball', `board__ball--${player}`, winning ? 'board__ball--winner' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <span
      className={className}
      style={{ gridColumn: col + 1, gridRow: row + 1, '--ball-row': row }}
      aria-hidden="true"
    />
  );
}

export default Ball;
