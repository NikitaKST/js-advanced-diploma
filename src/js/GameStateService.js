export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    const savedState = {
      level: state.level,
      countCharacters: state.countCharacters,
      score: state.score,
      survivors: state.survivors,
      teamsPlayer: state.teamsPlayer.teams.map((char) => ({
        type: char.type,
        level: char.level,
        health: char.health,
        attack: char.attack,
        defence: char.defence,
      })),
      teamsComputer: state.teamsComputer.teams.map((char) => ({
        type: char.type,
        level: char.level,
        health: char.health,
        attack: char.attack,
        defence: char.defence,
      })),
    };
    this.storage.setItem('state', JSON.stringify(savedState));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
