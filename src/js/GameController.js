/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-expressions */
import themes from './themes.js';
import PositionedCharacter from './PositionedCharacter.js';
import { installPrototype } from './utils.js';
import GameState from './GameState.js';
import {
  generateMessage, generatePositionComputer, generatePositionPlayer,
  characterGenerator, generateRandomKey, generateTeam,
} from './generators.js';
import GamePlay from './GamePlay.js';
import cursors from './cursors.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.gameState = new GameState();
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.drawUi(themes[this.gameState.level]);
  }

  start() {
    this.generateTeams();
    this.generatePlayersonBoard();
    this.gamePlay.redrawPositions(this.gameState.teamsPositions);
  }

  generateTeams() {
    let count;
    if (this.gameState.survivors) {
      count = this.gameState.countCharacters - this.gameState.survivors;
      for (let i = 0; i < count; i += 1) {
        this.gameState.teamsPlayer.teams.push(characterGenerator(this.gameState.listTeamsPlayer, this.gameState.level).next().value);
      }
    } else {
      this.gameState.teamsPlayer = generateTeam(this.gameState.listTeamsPlayer, this.gameState.level, this.gameState.countCharacters);
    }
    this.gameState.teamsComputer = generateTeam(this.gameState.listTeamsComputer, this.gameState.level, this.gameState.countCharacters);
  }

  levelUpGame() {
    this.gameState.teamsPlayer.levelUpTeam();
    this.gameState.selectPositionIndex = null;
    this.gameState.possibleAttack = [];
    this.gameState.possiblePositions = [];
    this.gameState.countCharacters += 1;
  }

  generatePlayersonBoard() {
    const arrPlayerPosition = [];
    for (const el of this.gameState.teamsPlayer.teams) {
      let position = generatePositionPlayer(this.gamePlay.position);
      while (arrPlayerPosition.includes(position)) {
        position = generatePositionPlayer(this.gamePlay.position);
      }
      arrPlayerPosition.push(position);
      this.gameState.teamsPositions.push(new PositionedCharacter(el, position));
    }
    const arrComputerPosition = [];
    for (const item of this.gameState.teamsComputer.teams) {
      let positionComp = generatePositionComputer(this.gamePlay.position);
      while (arrComputerPosition.includes(positionComp)) {
        positionComp = generatePositionComputer(this.gamePlay.position);
      }
      arrComputerPosition.push(positionComp);
      this.gameState.teamsPositions.push(new PositionedCharacter(item, positionComp));
    }
    this.gameState.filterTeamsPosition();
  }

  checkDeath(character, index) {
    if (character.health <= 0) {
      const key = this.gameState.teamsPositions.findIndex((el) => el.position === index);
      let arr;
      if (this.gameState.teamsPlayer.teams.includes(character)) {
        arr = this.gameState.teamsPlayer.teams;
        this.gameState.clearSelectHero();
      } else {
        arr = this.gameState.teamsComputer.teams;
        this.gameState.addScore();
      }
      const keyTeams = arr.findIndex((el) => el.health <= 0);
      this.gameState.teamsPositions.splice(key, 1);
      arr.splice(keyTeams, 1);
      this.gameState.filterTeamsPosition();
      this.gamePlay.deselectCell(index);
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor(cursors.auto);
      if (this.gameState.teamsPlayer.teams.length === 0) {
        this.gameState.gameOver();
      }
    }
  }

  cleanCell(position) {
    this.gamePlay.deselectCell(position);
    this.gamePlay.setCursor(cursors.auto);
  }

  async attack(attacker, target, index) {
    this.gameState.attack = true;
    const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
    // eslint-disable-next-line no-param-reassign
    target.health -= damage;
    await this.gamePlay.showDamage(index, damage);
    this.checkDeath(target, index);
    this.gamePlay.redrawPositions(this.gameState.teamsPositions);
    this.updatePositionDate();
    this.gameState.attack = false;
  }

  updatePositionDate() {
    if (this.gameState.selectPositionIndex || this.gameState.selectPositionIndex === 0) {
      const index = this.gameState.selectPositionIndex;
      this.showPossibleTransition(index, this.gameState.searchHero(index).range);
      this.showOpportunityAttack(index, this.gameState.searchHero(index).rangeAttack);
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gameState.game) {
      if (this.gameState.teamsPositionIndex.includes(index)
     && this.gameState.teamsPlayer.teams.includes(this.gameState.searchHero(index))) {
        if (this.gameState.selectPositionIndex || this.gameState.selectPositionIndex === 0) {
          this.gamePlay.deselectCell(this.gameState.selectPositionIndex);
        }
        this.gamePlay.selectCell(index);
        this.gameState.selectPositionIndex = index;
        this.showPossibleTransition(index, this.gameState.searchHero(index).range);
        this.showOpportunityAttack(index, this.gameState.searchHero(index).rangeAttack);
      }

      // character attack in 0 cell
      if (this.gameState.teamsPositionIndex.includes(index)
    && !this.gameState.teamsPlayer.teams.includes(this.gameState.searchHero(index))
    && !this.gameState.selectPositionIndex) {
        if (this.gameState.selectPositionIndex || this.gameState.selectPositionIndex === 0) {
          this.attack(
            this.gameState.searchHero(this.gameState.selectPositionIndex),
            this.gameState.searchHero(index),
            index,
          ).then(() => this.riseOftheMonsters());
        } else {
          GamePlay.showError('Это не персонаж игрока!');
        }
      }

      if (this.gameState.selectPositionIndex === index) {
        this.gamePlay.setCursor(cursors.auto);
      }

      // character move

      if (this.gameState.possiblePositions.includes(index)) {
        this.transitionHeroPosition(index, this.gameState.selectPositionIndex);
        this.gameState.filterTeamsPosition();
        this.gamePlay.deselectCell(this.gameState.selectPositionIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.selectCell(index);
        this.gameState.selectPositionIndex = index;

        this.gamePlay.redrawPositions(this.gameState.teamsPositions);
        this.riseOftheMonsters();
        this.showPossibleTransition(index, this.gameState.searchHero(index).range);
        this.showOpportunityAttack(index, this.gameState.searchHero(index).rangeAttack);
      }

      // character attack

      if (this.gameState.possibleAttack.includes(index) && this.gameState.teamsPositionIndex.includes(index)
      && !this.gameState.attack) {
        if (!this.gameState.possiblePositions.includes(index)) {
          this.attack(
            this.gameState.searchHero(this.gameState.selectPositionIndex),
            this.gameState.searchHero(index),
            index,
          ).then(() => this.riseOftheMonsters());
        }
      }
    }
  }

  visualyMove() {
    if (this.gameState.selectPositionIndex) {
      this.showPossibleTransition(this.gameState.selectPositionIndex, this.gameState.searchHero(this.gameState.selectPositionIndex).range);
      this.showOpportunityAttack(this.gameState.selectPositionIndex, this.gameState.searchHero(this.gameState.selectPositionIndex).rangeAttack);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gameState.game) {
      if (this.gameState.teamsPositionIndex.includes(index)) {
        this.gamePlay.showCellTooltip(generateMessage(this.gameState.searchHero(index)), index);
        if (this.gameState.teamsPlayer.teams.includes(this.gameState.searchHero(index))) {
          this.gamePlay.setCursor(cursors.pointer);
        }
        if (this.gameState.teamsComputer.teams.includes(this.gameState.searchHero(index))) {
          if (this.gameState.possibleAttack.includes(index)) {
            this.gamePlay.selectCell(index, 'red');
            this.gamePlay.setCursor(cursors.crosshair);
          } else {
            this.gamePlay.setCursor(cursors.notallowed);
          }
        }
      }

      // color indication of possible moves
      if (this.gameState.possiblePositions.includes(index) && this.gameState.selectPositionIndex) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
      if (this.gameState.possiblePositions.includes(index) && this.gameState.selectPositionIndex === 0) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }

      if ((this.gameState.selectPositionIndex === index)) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
    // Chracter information on hover
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.gameState.game) {
      if (!this.gameState.teamsPositionIndex.includes(index)) {
        this.gamePlay.hideCellTooltip(index);
        this.gamePlay.setCursor(cursors.auto);
        this.gamePlay.deselectCell(index);
      }

      if (this.gameState.teamsPositionIndex.includes(index)
      && this.gameState.teamsComputer.teams.includes(this.gameState.searchHero(index))) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  onNewGameClick() {
    this.gameState = new GameState();
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.start();
  }

  onLoadGameClick() {
    if (this.stateService.storage.length > 0) {
      const load = this.stateService.load();
      load.teamsPosition = [];
      installPrototype(load.teamsPlayer.teams);
      installPrototype(load.teamsComputer.teams);
      this.gameState.from(load);
      this.gameState.teamsPositions = [];
      for (let i = 0; i < this.gameState.teamsPlayer.teams.length; i += 1) {
        this.gameState.teamsPositions.push(new PositionedCharacter(this.gameState.teamsPlayer.teams[i], this.gameState.teamsPositionIndex[i]));
      }
      for (let j = 0; j < this.gameState.teamsComputer.teams.length; j += 1) {
        const k = this.gameState.teamsPlayer.teams.length;
        const number = j + k;
        this.gameState.teamsPositions.push(new PositionedCharacter(this.gameState.teamsComputer.teams[j], this.gameState.teamsPositionIndex[number]));
      }
      this.gamePlay.drawUi(themes[this.gameState.level]);
      this.gamePlay.redrawPositions(this.gameState.teamsPositions);

      if (this.gameState.selectPositionIndex) {
        this.gamePlay.selectCell(this.gameState.selectPositionIndex);
      }
      alert('Игра загружена');
    } else {
      alert('Нет сохраненной игры');
    }
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
    alert('Игра сохранена');
  }

  transitionHeroPosition(index, selectCell) {
    const key = this.gameState.teamsPositions.findIndex((item) => item.position === selectCell);
    this.gameState.teamsPositions[key].position = index;
  }

  showPossibleTransition(index, range, boardSize = 8) {
    let position = [];

    // left
    let countLeft; let countTop; let countRight; let countBottom; let countLeftTop;
    let countRightTop; let countLeftBottom; let countRightBottom;

    index % boardSize > range ? countLeft = range : countLeft = index % boardSize;

    for (let i = 1; i <= countLeft; i += 1) {
      const indexTransition = index - i;
      position.push(indexTransition);
    }
    // right

    index % boardSize + range <= boardSize - 1 ? countRight = range
      : countRight = boardSize - 1 - (index % boardSize);

    for (let i = 1; i <= countRight; i += 1) {
      const indexTransition = index + i;
      position.push(indexTransition);
    }
    // top

    (Math.floor(index / boardSize) - range >= 0) ? countTop = range
      : countTop = Math.floor(index / boardSize);

    for (let i = 1; i <= countTop; i += 1) {
      const indexTransition = index - boardSize * i;
      position.push(indexTransition);
    }
    // bottom
    (Math.floor(index / boardSize) + range <= boardSize - 1) ? countBottom = range
      : countBottom = (boardSize - 1) - (Math.floor(index / boardSize));

    for (let i = 1; i <= countBottom; i += 1) {
      const indexTransition = index + boardSize * i;
      position.push(indexTransition);
    }

    // top-left diagonal
    let minLeftTop = null;
    Math.floor(index / boardSize) <= index % boardSize
      ? minLeftTop = Math.floor(index / boardSize) : minLeftTop = index % boardSize;
    (Math.floor(index / boardSize) - range >= 0 && index % boardSize > range)
      ? countLeftTop = range : countLeftTop = minLeftTop;

    for (let i = 1; i <= countLeftTop; i += 1) {
      const indexTransition = index - (boardSize * i) - i;
      position.push(indexTransition);
    }

    // top-right diagonal
    let minRightTop = null;
    Math.floor(index / boardSize) <= boardSize - 1 - index % boardSize
      ? minRightTop = Math.floor(index / boardSize)
      : minRightTop = boardSize - 1 - index % boardSize;

    Math.floor(index / boardSize) - range >= 0
    && (index % boardSize + range <= boardSize - 1)
      ? countRightTop = range : countRightTop = minRightTop;

    for (let i = 1; i <= countRightTop; i += 1) {
      const indexTransition = index - (boardSize * i) + i;
      position.push(indexTransition);
    }

    // bottom-left diagonal
    let minLeftBottom = null;
    boardSize - 1 - Math.floor(index / boardSize) <= index % boardSize
      ? minLeftBottom = boardSize - Math.floor(index / boardSize)
      : minLeftBottom = index % boardSize;

    (Math.floor(index / boardSize) + range <= boardSize - 1 && index % boardSize > range)
      ? countLeftBottom = range : countLeftBottom = minLeftBottom;

    for (let i = 1; i <= countLeftBottom; i += 1) {
      const indexTransition = index + (boardSize * i) - i;
      position.push(indexTransition);
    }

    // bottom-right diagonal
    let minRigthBottom = null;
    boardSize - 1 - index % boardSize <= boardSize - 1 - Math.floor(index / boardSize)
      ? minRigthBottom = boardSize - 1 - index % boardSize
      : minRigthBottom = boardSize - Math.floor(index / boardSize);

    index % boardSize + range <= boardSize - 1
      && Math.floor(index / boardSize) + range <= boardSize - 1
      ? countRightBottom = range : countRightBottom = minRigthBottom;

    for (let i = 1; i <= countRightBottom; i += 1) {
      const indexTransition = index + (boardSize * i) + i;
      position.push(indexTransition);
    }
    position = position.filter((el) => !this.gameState.teamsPositionIndex.includes(el));
    position = position.filter((el) => el <= boardSize ** 2 - 1);
    position = position.filter((el) => el >= 0);

    if (this.gameState.computerMove) {
      this.gameState.computerPosiblePosition = position;
    } else {
      this.gameState.possiblePositions = position;
    }
  }

  showOpportunityAttack(index, rangeAttack, boardSize = 8) {
    let positionAttack = [];

    let countLeft; let countTop; let countRight; let
      countBottom;
    (index % boardSize + rangeAttack <= boardSize - 1)
      ? countRight = rangeAttack : countRight = boardSize - 1 - (index % boardSize);

    (index % boardSize > rangeAttack) ? countLeft = rangeAttack
      : countLeft = index % boardSize;

    (Math.floor(index / boardSize) - rangeAttack >= 0)
      ? countTop = rangeAttack : countTop = Math.floor(index / boardSize);

    (Math.floor(index / boardSize) + rangeAttack <= boardSize - 1)
      ? countBottom = rangeAttack : countBottom = (boardSize - 1) - (Math.floor(index / boardSize));

    const start = index - countLeft - countTop * boardSize;
    const endRow = index + countRight - countTop * boardSize;
    const end = index + countBottom * boardSize;
    const count = Math.floor(end / boardSize) - Math.floor(start / boardSize);

    for (let j = start; j <= endRow; j += 1) {
      for (let i = 0; i <= count; i += 1) {
        const ind = j + i * boardSize;
        if (ind === index) {
          continue;
        }
        positionAttack.push(ind);
      }
    }
    positionAttack = positionAttack.filter((el) => el <= boardSize ** 2 - 1);
    positionAttack = positionAttack.filter((el) => el >= 0);
    if (this.gameState.computerMove) {
      this.gameState.computerPosibleAttack = positionAttack;
    } else {
      this.gameState.possibleAttack = positionAttack;
    }
  }

  riseOftheMonsters() {
    if (this.gameState.teamsComputer.teams.length > 0) {
      // create array computer and player team
      this.gameState.computerMove = true;
      const { teamsPlayer, teamsPositions } = this.gameState;

      const playerTeamPosition = teamsPositions.map((el) => el.position)
        .splice(0, teamsPlayer.teams.length);

      const computerTeamCharacter = teamsPositions.map((el) => el.character)
        .splice(teamsPlayer.teams.length, teamsPlayer.teams.length);
      const computerTeamPosition = teamsPositions.map((el) => el.position)
        .splice(teamsPlayer.teams.length, teamsPlayer.teams.length);
      let positionAttack = null;

      const compKey = generateRandomKey(computerTeamCharacter);
      // attack and movement positions

      const run = (() => {
        this.showPossibleTransition(computerTeamPosition[compKey], computerTeamCharacter[compKey]
          .range);
        const keysComp = generateRandomKey(this.gameState.computerPosiblePosition);
        this.transitionHeroPosition(this.gameState.computerPosiblePosition[keysComp], computerTeamPosition[compKey]);
        this.gameState.filterTeamsPosition();
        this.cleanCell(computerTeamPosition[compKey]);
        this.gamePlay.setCursor(cursors.auto);
        this.gamePlay.redrawPositions(this.gameState.teamsPositions);
      });

      let indexComputer;
      // // we go through the player’s positions for the possibility of attack
      for (const comp of computerTeamPosition) {
        if (positionAttack) {
          break;
        }
        this.showOpportunityAttack(comp, this.gameState.searchHero(comp).rangeAttack);
        indexComputer = this.gameState.searchHero(comp);
        for (const item of playerTeamPosition) {
          if (this.gameState.computerPosibleAttack.includes(item)) {
            positionAttack = item;
            break;
          }
        }
      }

      positionAttack ? this.attack(indexComputer, this.gameState.searchHero(positionAttack), positionAttack)
        : run();

      this.gameState.computerMove = false;
      this.visualyMove();
    }
    // check win level
    if (this.gameState.teamsComputer.teams.length === 0) {
      this.gameState.survivors = this.gameState.teamsPlayer.teams.length;
      this.gameState.teamsPositions = [];
      this.gameState.filterTeamsPosition();
      this.gameState.level += 1;
      if (this.gameState.level > 4) {
        this.gameState.level = 4;
        this.gameState.blockBoard();
        alert(`Поздравляем, Вы победили! Ваши очки ${this.gameState.score}`);
      } else {
        this.levelUpGame();
        this.gamePlay.drawUi(themes[this.gameState.level]);
        this.start();
      }
    }
  }
}
