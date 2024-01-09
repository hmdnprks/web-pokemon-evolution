import { Firmness } from '@component/interfaces/berry';

const firmnessMap: { [key in Firmness | 'others']: number } = {
  'very-soft': 2,
  soft: 3,
  hard: 5,
  'very-hard': 8,
  'super-hard': 10,
  others: 0,
};

const prohibitionBerryMap = [{
  before: 'very-soft',
  after: 'very-soft',
  weight: 4,
}, {
  before: 'soft',
  after: 'soft',
  weight: 6,
}, {
  before: 'hard',
  after: 'hard',
  weight: 10,
}, {
  before: 'very-hard',
  after: 'very-hard',
  weight: 16,
}, {
  before: 'super-hard',
  after: 'super-hard',
  weight: 20,
}];

export { firmnessMap, prohibitionBerryMap };
