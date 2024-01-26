import Bowman from '../characters/Bowman';
import { generateMessage } from '../generators';

test('generate message', () => {
  const character = new Bowman(1);
  const result = generateMessage(character);
  expect(result).toEqual('🎖 1 ⚔ 25 🛡 25 ❤ 50');
});
