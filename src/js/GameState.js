import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import Team from './Team';

export default class GameState {
  constructor() {
    this.score = 0;
    this.record = null;
    this.level = 1;
    this.countCharacters = this.level + 1;
    this.survivors = null;
    this.attack = false;
    this.game = true;
    this.listTeamsPlayer = [Bowman, Swordsman, Magician];
    this.listTeamsComputer = [Vampire, Undead, Daemon];
    this.teamsPositions = [];
    this.teamsPositionIndex = [];
    this.teamsComputerPositions = [];
    this.possiblePositions = [];
    this.computerPosiblePosition = [];
    this.possibleAttack = [];
    this.computerPosibleAttack = [];
    this.teamsPlayer = [];
    this.teamsComputer = [];
    this.selectPositionIndex = null;
    this.computerMove = false;
  }

  from(object) {
    // TODO: create object
    this.score = object.score;
    this.level = object.level;
    this.countCharacters = object.countCharacters;
    this.survivors = object.survivors;
    this.attack = object.attack;
    this.game = object.game;
    this.listTeamsPlayer = [Bowman, Swordsman, Magician];
    this.listTeamsComputer = [Vampire, Undead, Daemon];
    this.teamsPositions = object.teamsPositions;
    this.teamsPositionIndex = object.teamsPositionIndex;
    this.teamsComputerPositions = object.teamsComputerPositions;
    this.possiblePositions = object.possiblePositions;
    this.computerPosiblePosition = object.computerPosiblePosition;
    this.possibleAttack = object.possibleAttack;
    this.computerPosibleAttack = object.computerPosibleAttack;
    this.teamsPlayer = new Team(object.teamsPlayer.teams);
    this.teamsComputer = new Team(object.teamsComputer.teams);
    this.selectPositionIndex = object.selectPositionIndex;
    this.computerMove = object.computerMove;
    return null;
  }

  clearSelectHero() {
    this.selectPositionIndex = null;
    this.possibleAttack = [];
    this.possiblePositions = [];
  }

  filterTeamsPosition() {
    this.teamsPositionIndex = this.teamsPositions.map((el) => el.position);
  }

  blockBoard() {
    this.game = false;
    this.teamsPositions = [];
    this.clearSelectHero();
  }

  gameOver() {
    this.blockBoard();
    if (this.score < this.record) {
      this.record = this.score;
    }
    // eslint-disable-next-line no-alert
    alert('Вы проиграли');
  }

  searchHero(index) {
    const key = this.teamsPositions.findIndex((item) => item.position === index);
    return this.teamsPositions[key].character;
  }

  addScore() {
    this.score += 100;
  }
}
