import GameStateService from '../GameStateService';
import Bowman from '../characters/Bowman';

let stateService;
jest.mock('../GameStateService');

beforeEach(() => {
  stateService = new GameStateService();
  jest.resetAllMocks();
});

describe('load', () => {
  test('done load', () => {
    const expected = new Bowman();
    stateService.load.mockReturnValue(expected);
    expect(stateService.load()).toEqual(expected);
  });

  test('error load', () => {
    stateService.load = jest.fn(() => {
      throw new Error('Invalid state');
    });
    expect(() => stateService.load()).toThrow(new Error('Invalid state'));
  });
});
