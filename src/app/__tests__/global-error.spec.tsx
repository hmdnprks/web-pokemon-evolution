import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalError from '../global-error';
import * as Sentry from '@sentry/nextjs';

// Mocking Sentry and Next.js Error component
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

jest.mock('next/error', () => jest.fn(() => 'NextErrorComponent'));

describe('GlobalError Component', () => {
  const mockError = new Error('Test Error');
  const mockStatusCode = 500;

  it('captures exception with Sentry', () => {
    render(<GlobalError error={mockError} statusCode={mockStatusCode} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
  });

  it('renders Next.js Error component with correct status code', () => {
    render(<GlobalError error={mockError} statusCode={mockStatusCode} />);

    expect(screen.getByText('NextErrorComponent')).toBeInTheDocument();
  });
});
