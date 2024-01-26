import GameController from '../GameController';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

const gameController = new GameController();

test('test move magician', () => {
  const magician = new Magician();
  const index = 12;
  gameController.showPossibleTransition(index, magician.range);
  expect(gameController.gameState.possiblePositions).toEqual([11, 13, 4, 20, 3, 5, 19, 21]);
});

test('test move bowman', () => {
  const bowman = new Bowman();
  const index = 12;
  gameController.showPossibleTransition(index, bowman.range);
  expect(gameController.gameState.possiblePositions)
    .toEqual([11, 10, 13, 14, 4, 20, 28, 3, 5, 19, 26, 21, 30]);
});

test('test move swordsman', () => {
  const swordsman = new Swordsman();
  const index = 12;
  gameController.showPossibleTransition(index, swordsman.range);
  expect(gameController.gameState.possiblePositions)
    .toEqual([11, 10, 9, 8, 13, 14, 15, 4, 20, 28, 36, 44, 3, 5, 19, 26, 33, 40, 21, 30, 39]);
});

test('test move daemon', () => {
  const daemon = new Daemon();
  const index = 12;
  gameController.showPossibleTransition(index, daemon.range);
  expect(gameController.gameState.possiblePositions).toEqual([11, 13, 4, 20, 3, 5, 19, 21]);
});

test('test move vampire', () => {
  const vampire = new Vampire();
  const index = 12;
  gameController.showPossibleTransition(index, vampire.range);
  expect(gameController.gameState.possiblePositions)
    .toEqual([11, 10, 13, 14, 4, 20, 28, 3, 5, 19, 26, 21, 30]);
});

test('test move undead', () => {
  const undead = new Undead();
  const index = 12;
  gameController.showPossibleTransition(index, undead.range);
  expect(gameController.gameState.possiblePositions)
    .toEqual([11, 10, 9, 8, 13, 14, 15, 4, 20, 28, 36, 44, 3, 5, 19, 26, 33, 40, 21, 30, 39]);
});
