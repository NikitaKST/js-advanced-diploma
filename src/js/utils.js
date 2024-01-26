/* eslint-disable default-case */
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */

import Swordsman from './characters/Swordsman.js';
import Magician from './characters/Magician.js';
import Bowman from './characters/Bowman.js';
import Undead from './characters/Undead.js';
import Daemon from './characters/Daemon.js';
import Vampire from './characters/Vampire.js';

export function calcTileType(index, boardSize) {
  const lastField = boardSize ** 2 - 1;
  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }
  if (index < lastField && index > lastField - boardSize + 1) {
    return 'bottom';
  }
  if ((((index / boardSize) % 1) === 0) && index / boardSize > 0
  && index / boardSize < boardSize - 1) {
    return 'left';
  }
  if ((((index - (boardSize - 1)) / (boardSize)) % 1) === 0
  && index / (boardSize - 1) > 1
  && index / (boardSize - 1) < boardSize) {
    return 'right';
  }
  if (index === 0) {
    return 'top-left';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index === lastField - boardSize + 1) {
    return 'bottom-left';
  }
  if (index === lastField) {
    return 'bottom-right';
  }
  // TODO: ваш код будет тут
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcCoordinateCharacter(index, boardSize = 8) {
  return { x: index % boardSize, y: Math.floor(index / boardSize) };
}

export function filterPosition(arr) {
  arr.filter((el) => el.position);
}

export function installPrototype(arr) {
  arr.forEach((el) => {
    switch (el.type) {
      case 'bowman':
        Object.setPrototypeOf(el, Bowman.prototype);
        break;
      case 'swordsman':
        Object.setPrototypeOf(el, Swordsman.prototype);
        break;
      case 'magician':
        Object.setPrototypeOf(el, Magician.prototype);
        break;
      case 'undead':
        Object.setPrototypeOf(el, Undead.prototype);
        break;
      case 'vampire':
        Object.setPrototypeOf(el, Vampire.prototype);
        break;
      case 'daemon':
        Object.setPrototypeOf(el, Daemon.prototype);
        break;
    }
  });
}
