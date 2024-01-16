import { render } from '@testing-library/react';
import ChevronAnimation from './ChevronAnimation';

describe('ChevronAnimation', () => {
  it('renders correctly with arrow up', () => {
    const { getAllByRole } = render(<ChevronAnimation arrow="up" />);

    const images = getAllByRole('img');
    expect(images).toHaveLength(3);
    images.forEach((img) => {
      expect(img).toHaveAttribute('src', '/chevron-up.svg');
    });
  });

  it('renders correctly with arrow down', () => {
    const { getAllByRole } = render(<ChevronAnimation arrow="down" />);

    const images = getAllByRole('img');
    expect(images).toHaveLength(3);
    images.forEach((img) => {
      expect(img).toHaveAttribute('src', '/chevron-down.svg');
    });
  });

  it('has correct classes for animation delay', () => {
    const { container } = render(<ChevronAnimation arrow="up" />);

    const divs = container.querySelectorAll('div.chevron-up');

    expect(divs[1]).toHaveClass('animation-delay-200');
    expect(divs[2]).toHaveClass('animation-delay-400');
  });
});
