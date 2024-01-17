import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../layout';
import ReactQueryContextProvider from '@component/contexts/reactQueryContext';

jest.mock('next/font/google', () => ({
  Poppins: jest.fn().mockReturnValue({ className: 'poppins-class' }),
}));
jest.mock('@component/contexts/reactQueryContext', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
}));

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>,
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('applies Poppins font class to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );
    expect(container.querySelector('body')).toHaveClass('poppins-class');
  });

  it('provides ReactQueryContext', () => {
    render(
      <RootLayout>
        <div>Test Context</div>
      </RootLayout>,
    );
    expect(ReactQueryContextProvider).toHaveBeenCalled();
  });

  it('sets language to English', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Language</div>
      </RootLayout>,
    );
    expect(container.querySelector('html')).toHaveAttribute('lang', 'en');
  });

  it('contains the specified metadata', () => {
    const { metadata } = require('../layout');
    expect(metadata.title).toBe('Pokemon Evolution App');
    expect(metadata.description).toBe(
      'A simple app to search for Pokemon and see their evolutions',
    );
  });
});
