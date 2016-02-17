# SolarWinds MineSweeper programming contest

## How to start project

### Prerequisites

    npm install -g gulp tsd bower typescript

### How to run project

    gulp

## MineSweeper rules

The rules of minesweeper are simple:
 
- Uncover a mine, and the game ends.
- Uncover an empty square, and you keep playing.
- Uncover a number, and it tells you how many mines lay hidden in the eight surrounding squares—information you use to 
  deduce which nearby squares are safe to click.

## Implementation tasks

To make the contest doable in 1-2 hours, you're getting a template project with prepared data types and services to
 facilitate the implementation. You'll be focusing on building AngularJS directives and UI for the game.


## Where to start

### Main view: src/views/game

This is the main view for the application. It shows the MineSweeper game board and handles management of the game 
life cycle. 

### Important components

#### Minefield: src/components/minefield

Displays the minefield, which is basically a matrix of mines. It gets the minefield data as an attribute and 
is supposed to draw the matrix.

#### Mine: src/components/mine
 
This component displays single mine cell and should display properly all it's states like e.g.: hidden, revealed, 
revealed mine, flagged, etc. It contains a styled button and should handle it's click event properly according to 
current state of the cell.

The states of the cell are listed in MinefieldCellStatus class members:
- HIDDEN - default state of the cell
- REVEALED - after clicking on the cell it shows whether there is a mine or the number of adjacent cells 
                containing mines
- FLAGGED - you can flag the cell by shift-click if you suspect it to contain a mine

CSS classes to be used during mine component implementation:

- .sw-mine__button--hidden: for hidden cell
- .sw-mine__button--revealed: for revealed cell
- .sw-mine__button--has-mine: for revealed cell with mine
- .sw-mine__button--flagged: for flagged cell
- .sw-mine__button--neighbours-1 ... .sw-mine__button--neighbours-8: for revealed cells with respective neighbour counts 
