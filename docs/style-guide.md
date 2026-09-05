# Libro de estilo

Guía de diseño del proyecto **4 en Raya**, inspirada en la estética de producto de
[near.com](https://near.com/): fondo oscuro, superficies de cristal y acentos con gradiente
sutil. Todos los valores se materializan como _custom properties_ en
`src/styles/tokens.css`; no se repiten valores sueltos en los estilos de componentes.

## Paleta de colores

| Token                    | Valor                     | Uso                                   |
| ------------------------ | ------------------------- | ------------------------------------- |
| `--color-bg`             | `#0a0a0b`                 | Fondo general de la aplicación        |
| `--color-surface`        | `#14151a`                 | Superficies (tarjetas, paneles)       |
| `--color-surface-raised` | `#1c1d24`                 | Superficies elevadas (hover, modales) |
| `--color-text-primary`   | `#f5f5f4`                 | Texto principal                       |
| `--color-text-secondary` | `#a1a1aa`                 | Texto secundario (labels, ayudas)     |
| `--color-border`         | `rgb(255 255 255 / 0.08)` | Bordes y divisores                    |
| `--color-primary`        | `#4f8cff`                 | Acción principal (botón Jugar, foco)  |
| `--color-success`        | `#22c55e`                 | Estados de éxito                      |
| `--color-error`          | `#ef4444`                 | Estados de error / jugador 1          |
| `--color-warning`        | `#f59e0b`                 | Estados de advertencia                |

### Tablero y bolitas

| Token                   | Valor     | Uso                                |
| ----------------------- | --------- | ---------------------------------- |
| `--color-board-frame`   | `#1a1d24` | Marco del tablero                  |
| `--color-board-hole`    | `#0a0a0b` | Interior de los huecos del tablero |
| `--color-ball-player-1` | `#ef4444` | Bolita del jugador 1 (roja)        |
| `--color-ball-player-2` | `#3b82f6` | Bolita del jugador 2 (azul)        |
| `--color-ball-border`   | `#000000` | Borde de las bolitas               |
| `--ball-border-width`   | `10px`    | Grosor del borde de las bolitas    |

## Tipografía

Familia **Inter** (Google Fonts), con `system-ui` como respaldo.

| Jerarquía         | Token                  | Tamaño   | Peso |
| ----------------- | ---------------------- | -------- | ---- |
| Display (portada) | `--font-size-display`  | 2.5rem   | 800  |
| Título de sección | `--font-size-title`    | 1.5rem   | 700  |
| Subtítulo         | `--font-size-subtitle` | 1.125rem | 600  |
| Cuerpo            | `--font-size-body`     | 1rem     | 400  |
| Label             | `--font-size-label`    | 0.875rem | 500  |
| Caption           | `--font-size-caption`  | 0.75rem  | 400  |

## Espaciados y grilla

Escala de espaciado: `--spacing-xs` (0.25rem), `--spacing-sm` (0.5rem),
`--spacing-md` (0.75rem), `--spacing-lg` (1rem), `--spacing-xl` (1.5rem),
`--spacing-xxl` (2rem), `--spacing-xxxl` (3rem), `--spacing-xxxxl` (4rem).

El layout es **mobile-first**: los estilos base apuntan a pantallas pequeñas y se amplían con
_media queries_ de `min-width` hacia pantallas mayores.

## Radios y sombras

- Radios: `--radius-sm` (0.5rem), `--radius-md` (0.75rem), `--radius-lg` (1rem),
  `--radius-full` (9999px, bolitas y pills).
- Sombras: `--shadow-sm`, `--shadow-md`, `--shadow-lg` (negras con opacidad para fondo oscuro).
- Foco visible: `--focus-ring` (anillo azul translúcido).

## Componentes base

### Button

| Estado         | Apariencia                                                        |
| -------------- | ----------------------------------------------------------------- |
| Default        | Fondo `--color-primary`, texto blanco, radio `--radius-md`        |
| Hover          | Fondo `--color-primary-hover`                                     |
| Active         | Fondo `--color-primary-active`                                    |
| Disabled       | Opacidad 0.5, cursor `not-allowed`                                |
| Variante ghost | Superficie translúcida con borde, usada para acciones secundarias |

### Scoreboard

Panel de cristal sobre el tablero con dos columnas (jugador 1 / jugador 2), contadores de
victorias y un separador `vs` central. El jugador en turno se resalta con un punto de color y
mayor opacidad.

### Tablero

Marco oscuro con **42 huecos circulares** (7 columnas × 6 filas). Las bolitas viven detrás del
marco (z-index menor) y solo se ven a través de los huecos. La bolita que cae comienza un 15%
dentro del tablero y por debajo de este en z-index, de modo que parece deslizarse por detrás
del marco superior.

## Iconografía

Se usa la librería **Material Symbols** (Google) como estándar; no se incrustan emojis en la
interfaz ni en el código. Los iconos se renderizan con la clase `material-symbols-rounded`.
