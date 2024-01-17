import { render } from '@testing-library/react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import ReactQueryContextProvider from '../reactQueryContext';

describe('ReactQueryContextProvider', () => {
  it('provides a QueryClient to its children', () => {
    const ChildComponent = () => {
      const queryClient = useQueryClient();
      expect(queryClient).toBeInstanceOf(QueryClient);
      return null;
    };

    render(
      <ReactQueryContextProvider>
        <ChildComponent />
      </ReactQueryContextProvider>,
    );
  });
});
