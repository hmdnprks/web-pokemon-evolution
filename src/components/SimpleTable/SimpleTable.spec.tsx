import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleTable from './SimpleTable';

const headers = ['ID', 'Name', 'Age'];
const data = [
  [1, 'John Doe', 28],
  [2, 'Jane Doe', 32],
  [3, 'Jim Smith', 45],
];

describe('SimpleTable Component', () => {
  it('renders headers correctly', () => {
    render(<SimpleTable data={data} headers={headers} />);
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders the correct number of rows', () => {
    render(<SimpleTable data={data} headers={headers} />);
    const numberOfRows = data.length + 1;
    expect(screen.getAllByRole('row').length).toBe(numberOfRows);
  });

  it('renders the correct data in each cell', () => {
    render(<SimpleTable data={data} headers={headers} />);
    data.forEach((row) => {
      row.forEach((cell) => {
        expect(screen.getByText(cell.toString())).toBeInTheDocument();
      });
    });
  });

  it('handles empty data gracefully', () => {
    render(<SimpleTable data={[]} headers={headers} />);
    const numberOfRows = 1;
    expect(screen.getAllByRole('row').length).toBe(numberOfRows);
  });

  it('renders without any headers and data', () => {
    render(<SimpleTable data={[]} headers={[]} />);
    expect(screen.queryByRole('columnheader')).toBeNull();
    expect(screen.queryByRole('cell')).toBeNull();
  });
});
