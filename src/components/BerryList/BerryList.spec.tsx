import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BerryList from './BerryList';
import '@testing-library/jest-dom';
import { BerryItemResult } from '@component/interfaces/berry';

describe('BerryList', () => {
  const mockBerries: BerryItemResult[] = [
    { id: '1', name: 'Cheri', imageUrl: '/cheri.png', firmness: 'very-soft', url: 'https://pokeapi.co/api/v2/berry/1/' },
    { id: '2', name: 'Chesto', imageUrl: '/chesto.png', firmness: 'very-soft', url: 'https://pokeapi.co/api/v2/berry/2/' },
  ];

  it('renders the list of berries', () => {
    render(<BerryList berries={mockBerries} setSelectedBerry={() => { }} />);
    const berryElements = screen.getAllByRole('img');
    expect(berryElements).toHaveLength(mockBerries.length);
  });

  it('calls setSelectedBerry when a berry is clicked', () => {
    const mockSetSelectedBerry = jest.fn();
    render(<BerryList berries={mockBerries} setSelectedBerry={mockSetSelectedBerry} />);
    const firstBerry = screen.getByAltText('Cheri');
    fireEvent.click(firstBerry);
    expect(mockSetSelectedBerry).toHaveBeenCalledWith(mockBerries[0]);
  });

  it('highlights the selected berry', () => {
    const { rerender } = render(<BerryList berries={mockBerries} setSelectedBerry={() => { }} />);
    const firstBerry = screen.getByAltText('Cheri');
    fireEvent.click(firstBerry);
    rerender(<BerryList berries={mockBerries} setSelectedBerry={() => { }} />);
    expect(firstBerry.parentElement).toHaveClass('bg-red-300');
  });

  it('displays the correct alt text for each berry image', () => {
    render(<BerryList berries={mockBerries} setSelectedBerry={() => { }} />);
    const firstBerryName = screen.getByAltText('Cheri');
    const secondBerryName = screen.getByAltText('Chesto');
    expect(firstBerryName).toBeInTheDocument();
    expect(secondBerryName).toBeInTheDocument();
  });

  it('does not render any berries when berries array is empty', () => {
    render(<BerryList berries={[]} setSelectedBerry={() => { }} />);
    const berryElements = screen.queryAllByRole('img');
    expect(berryElements).toHaveLength(0);
  });
});
