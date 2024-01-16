import { firmnessMap, prohibitionBerryMap } from './berry-weight';

describe('Berry Weight Constants', () => {
  it('firmnessMap has correct values', () => {
    expect(firmnessMap).toEqual({
      'very-soft': 2,
      soft: 3,
      hard: 5,
      'very-hard': 8,
      'super-hard': 10,
      others: 0,
    });
  });

  it('prohibitionBerryMap has correct values', () => {
    expect(prohibitionBerryMap).toEqual([
      {
        before: 'very-soft',
        after: 'very-soft',
        weight: 4,
      },
      {
        before: 'soft',
        after: 'soft',
        weight: 6,
      },
      {
        before: 'hard',
        after: 'hard',
        weight: 10,
      },
      {
        before: 'very-hard',
        after: 'very-hard',
        weight: 16,
      },
      {
        before: 'super-hard',
        after: 'super-hard',
        weight: 20,
      },
    ]);
  });
});
