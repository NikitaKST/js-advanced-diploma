import Character from '../Character';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('Throw error new Character', () => {
  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const character = new Character();
  }).toThrow('Нельзя создавать класс Character');
});

test('create class bowman', () => {
  const bowman = new Bowman(1);
  expect(bowman).toEqual({
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    position: null,
    range: 2,
    rangeAttack: 2,
    type: 'bowman',
  });
});

test('create class daemon', () => {
  const daemon = new Daemon(1);
  expect(daemon).toEqual({
    attack: 10,
    defence: 10,
    health: 50,
    level: 1,
    position: null,
    range: 1,
    rangeAttack: 4,
    type: 'daemon',
  });
});

test('create class magician', () => {
  const magician = new Magician(1);
  expect(magician).toEqual({
    attack: 10,
    defence: 40,
    health: 50,
    level: 1,
    position: null,
    range: 1,
    rangeAttack: 4,
    type: 'magician',
  });
});

test('create class swordsman', () => {
  const swordsman = new Swordsman(1);
  expect(swordsman).toEqual({
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    position: null,
    range: 4,
    rangeAttack: 1,
    type: 'swordsman',
  });
});

test('create class undead', () => {
  const undead = new Undead(1);
  expect(undead).toEqual({
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    position: null,
    range: 4,
    rangeAttack: 1,
    type: 'undead',
  });
});

test('create class vampire', () => {
  const vampire = new Vampire(1);
  expect(vampire).toEqual({
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    position: null,
    range: 2,
    rangeAttack: 2,
    type: 'vampire',
  });
});
