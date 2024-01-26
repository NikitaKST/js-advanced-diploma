import Team from './Team.js';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const keyCharacter = Math.round(Math.random() * (allowedTypes.length - 1));
  const randomLevel = Math.round(Math.random() * (maxLevel - 1)) + 1;
  yield new allowedTypes[keyCharacter](randomLevel);
  // TODO: write logic here
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  for (let count = 1; count <= characterCount; count += 1) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return new Team(characters);
  // TODO: write logic here
}

export function generatePositionPlayer(gameplayPosition) {
  const playerPosition = gameplayPosition.filter((el) => ((el - 1) % 8 === 0) || (el % 8 === 0));
  const key = Math.round(Math.random() * (playerPosition.length - 1));
  return playerPosition[key];
}

export function generatePositionComputer(gameplayPosition) {
  const computerPosition = gameplayPosition.filter((it) => (((it - 6) % 8 === 0)
   || ((it - 7) % 8 === 0)));
  const key = Math.round(Math.random() * (computerPosition.length - 1));
  return computerPosition[key];
}

export function generateMessage(character) {
  const medal = String.fromCodePoint(0x1F396);
  const swords = String.fromCodePoint(0x2694);
  const shield = String.fromCodePoint(0x1F6E1);
  const heart = String.fromCodePoint(0x2764);

  return `${medal} ${character.level} ${swords} ${character.attack} ${shield} ${character.defence} ${heart} ${character.health}`;
}

export function generateRandomKey(arr) {
  return Math.floor(Math.random() * (arr.length - 1));
}
