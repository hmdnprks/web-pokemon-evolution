'use client';
import * as Sentry from '@sentry/nextjs';
import ErrorComponent from 'next/error';
import { useEffect, FC } from 'react';

interface GlobalErrorProps {
  error: Error;
  statusCode: number;
}

const GlobalError: FC<GlobalErrorProps> = ({ error, statusCode }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorComponent statusCode={statusCode} />
      </body>
    </html>
  );
};

export default GlobalError;
