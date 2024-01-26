/* eslint-disable no-sparse-arrays */
/* eslint-disable max-len */
import GameController from '../GameController';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

const gameController = new GameController();

test('test attack magician', () => {
  const magician = new Magician();
  const index = 30;
  gameController.showOpportunityAttack(index, magician.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([2, 10, 18, 26, 34, 42, 50, 58, 3, 11, 19, 27, 35, 43, 51, 59, 4, 12, 20, 28, 36, 44, 52, 60, 5, 13, 21, 29, 37, 45, 53, 61, 6, 14, 22, 38, 46, 54, 62, 7, 15, 23, 31, 39, 47, 55, 63]);
});

test('test attack bowman', () => {
  const bowman = new Bowman();
  const index = 30;
  gameController.showOpportunityAttack(index, bowman.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([12, 20, 28, 36, 44, 13, 21, 29, 37, 45, 14, 22, 38, 46, 15, 23, 31, 39, 47]);
});

test('test attack swordsman', () => {
  const swordsman = new Swordsman();
  const index = 30;
  gameController.showOpportunityAttack(index, swordsman.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([21, 29, 37, 22, 38, 23, 31, 39]);
});

test('test attack daemon', () => {
  const daemon = new Daemon();
  const index = 30;
  gameController.showOpportunityAttack(index, daemon.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([2, 10, 18, 26, 34, 42, 50, 58, 3, 11, 19, 27, 35, 43, 51, 59, 4, 12, 20, 28, 36, 44, 52, 60, 5, 13, 21, 29, 37, 45, 53, 61, 6, 14, 22, 38, 46, 54, 62, 7, 15, 23, 31, 39, 47, 55, 63]);
});

test('test attack vampire', () => {
  const vampire = new Vampire();
  const index = 30;
  gameController.showOpportunityAttack(index, vampire.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([12, 20, 28, 36, 44, 13, 21, 29, 37, 45, 14, 22, 38, 46, 15, 23, 31, 39, 47]);
});

test('test attack undead', () => {
  const undead = new Undead();
  const index = 30;
  gameController.showOpportunityAttack(index, undead.rangeAttack);
  expect(gameController.gameState.possibleAttack)
    .toEqual([21, 29, 37, 22, 38, 23, 31, 39]);
});
