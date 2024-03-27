import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

const mockTabs = [
  { id: 1, title: 'Tab 1', content: 'Content 1' },
  { id: 2, title: 'Tab 2', content: 'Content 2' },
  { id: 3, title: 'Tab 3', content: 'Content 3' },
];

describe('Tabs Component', () => {
  it('renders correctly with initial active tab', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();
  });

  it('changes active tab on click', () => {
    render(<Tabs tabs={mockTabs} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();
  });

  it('displays the correct content for the active tab', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Tab 3'));
    expect(screen.getByText('Content 3')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).toBeNull();
    expect(screen.queryByText('Content 2')).toBeNull();
  });
});
