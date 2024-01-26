import { calcTileType } from '../utils';

test('test calcTileTypeTop', () => {
  const result = calcTileType(2, 8);
  expect(result).toBe('top');
});
test('test calcTileTypeBottom', () => {
  const result = calcTileType(60, 8);
  expect(result).toBe('bottom');
});
test('test calcTileTypeLeft', () => {
  const result = calcTileType(8, 8);
  expect(result).toBe('left');
});
test('test calcTileTypeRight', () => {
  const result = calcTileType(15, 8);
  expect(result).toBe('right');
});
test('test calcTileTypeCenter', () => {
  const result = calcTileType(12, 8);
  expect(result).toBe('center');
});
test('test calcTileTypeTopLeft', () => {
  const result = calcTileType(0, 8);
  expect(result).toBe('top-left');
});
test('test calcTileTypeTopRight', () => {
  const result = calcTileType(7, 8);
  expect(result).toBe('top-right');
});

test('test calcTileTypeBottomLeft', () => {
  const result = calcTileType(56, 8);
  expect(result).toBe('bottom-left');
});

test('test calcTileTypeBottomRight', () => {
  const result = calcTileType(63, 8);
  expect(result).toBe('bottom-right');
});
