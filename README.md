# SolarWinds MineSweeper programming contest

## Main goal

Your task will be to implement the [MineSweeper](https://en.wikipedia.org/wiki/Microsoft_Minesweeper) game by *satisfying as many prepared unit tests as possible*. Implement the test cases in order, some of them depend on previous ones!

## MineSweeper rules

The rules of minesweeper are simple:
 
- Uncover a mine, and the game ends with failure.
- Uncover an empty cell, and you keep playing.
- Uncover a number, and it tells you how many mines lay hidden in the eight surrounding cells—information you use to 
  deduce which nearby cells are safe to click.
- Uncover all unmined cells to win the game.

# Hot to setup your environment

## Wi-fi

Network: `guest`

Password: `longhornsolarwifi`

## How to run project

Clone or download the zip from this repo:

https://github.com/lukasholcik/minesweeper-template/

Run these commands in your project directory:
```
npm install -g gulp tsd bower typescript
npm install
npm start
```

## How to execute tests

Run:
```
npm test
``` 
...or the `karma.conf.js` file directly in your IDE (WebStorm supports that) to see the test results. 
