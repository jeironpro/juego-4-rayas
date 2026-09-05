# 4 en Raya

## Descripción

Juego de **4 en raya (Connect Four)** de **7×6** implementado como aplicación web. El
objetivo es conectar **cuatro bolitas propias en línea** — horizontal, vertical o diagonal —
antes que el rival. Se puede jugar de dos maneras:

- **Contra el bot** (implementado en JavaScript puro) en tres niveles: Fácil, Medio y Difícil.
- **Dos jugadores en el mismo tablero** (hot-seat), con turno alternado.

El **scoreboard** superior muestra los nombres de los jugadores y sus **victorias por ronda**
(`TÚ | BOT` con `0 vs 0` de partida), resaltando siempre al jugador en turno. Al terminar cada
partida se indica el ganador o el empate y se puede jugar otra ronda manteniendo el marcador.

## Reglas del juego

- Tablero de **7 columnas × 6 filas** de bolitas.
- En cada turno se deja caer una bolita en una columna; cae hasta la **fila libre más baja**.
- Gana quien consiga **cuatro bolitas contiguas** en horizontal, vertical o diagonal.
- Si el tablero se llena sin que nadie conecte cuatro, la partida es **empate**.
- El jugador 1 usa **bolitas rojas** y el jugador 2 **bolitas azules**, ambas con borde negro.
- La bolita que cae arranca encima del tablero, con su **15% inferior ya dentro del tablero**
  y con un **z-index menor al del tablero**: se desliza por detrás del marco y solo se ve a
  través de los huecos, como en el juego físico.

## Stack

| Tecnología               | Uso                                                |
| ------------------------ | -------------------------------------------------- |
| React 19                 | Interfaz de usuario (SPA)                          |
| Vite 8                   | Bundler y dev server                               |
| Yarn 4                   | Gestor de paquetes (fijado en `packageManager`)    |
| Vitest + Testing Library | Tests unitarios y de componentes                   |
| ESLint + Prettier        | Lint y formato (Husky + lint-staged en pre-commit) |
| GitHub Actions           | CI: lint, tests y build por PR                     |

## Cómo correr

Requisitos: Node.js 24 (ver `.nvmrc`) y Yarn 4.

```bash
yarn install # instala dependencias
yarn dev     # servidor de desarrollo (http://localhost:5173)
yarn build   # build de producción en dist/
yarn preview # sirve el build localmente
yarn test    # ejecuta los tests (Vitest)
yarn lint    # ejecuta ESLint
yarn format  # formatea el código con Prettier
```

## Estructura del proyecto

```
src/
  components/ui/       # componentes genéricos (Button, Icon)
  features/game/       # motor de reglas en JS puro (constants, board, wins, game) + tests
  features/bot/        # bot en JS puro (minimax + alfa-beta) y dificultades
  features/board/      # tablero interactivo (Board, Ball)
  features/scoreboard/ # marcador superior con contadores y turno activo
  features/menu/       # pantallas de inicio y fin de partida
  hooks/               # useGame (estado de la partida, turno del bot y marcador)
  styles/              # tokens de diseño y estilos base
docs/
  style-guide.md       # libro de estilo (colores, tipografía, componentes)
```

## Diseño

La interfaz usa una estética oscura de producto inspirada en [near.com](https://near.com/):
fondos profundos, superficies de cristal y acentos en tonos azul/violeta con brillos sutiles.
Todos los valores visuales (paleta, tipografía, espaciados, radios y sombras) viven como
_custom properties_ en `src/styles/tokens.css`, documentados en el [libro de estilo](docs/style-guide.md).
Los iconos usan la librería **Material Symbols** de Google.

## Calidad

- **Tests**: 56 tests entre el motor de reglas, el bot, el hook y los componentes
  (`yarn test`).
- **CI**: pipeline en `.github/workflows/ci.yml` que ejecuta lint, tests y build en cada
  pull request y push a `main`.
- **Pre-commit**: Husky + lint-staged aplican ESLint y Prettier sobre los archivos modificados.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más
detalles.
