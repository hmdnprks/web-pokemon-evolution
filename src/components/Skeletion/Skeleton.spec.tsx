import { render, screen } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders correctly', () => {
    render(<Skeleton />);

    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass('animate-pulse');
  });

  it('has the correct structure', () => {
    render(<Skeleton />);

    const skeletonElement = screen.getByTestId('skeleton');
    const children = skeletonElement.children;

    expect(children).toHaveLength(2);
    expect(children[0]).toHaveClass('bg-gray-300 h-24 w-full');
    expect(children[1]).toHaveClass('h-6 bg-gray-300 rounded mt-2 w-3/4 mx-auto');
  });

  it('has the correct styles', () => {
    render(<Skeleton />);

    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveClass('p-2 border border-gray-200 rounded-lg overflow-hidden');
  });
});
