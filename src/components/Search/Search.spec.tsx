import { render, fireEvent } from '@testing-library/react';
import SearchComponent from './Search';

describe('SearchComponent', () => {
  const onSearchMock = jest.fn();
  const clearSearchMock = jest.fn();

  beforeEach(() => {
    onSearchMock.mockClear();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchComponent clearSearch={clearSearchMock} onSearch={onSearchMock} />,
    );

    expect(getByPlaceholderText('Search Pokémon name or ID')).toBeInTheDocument();
  });

  it('calls onSearch when Enter key is pressed', () => {
    const { getByPlaceholderText } = render(
      <SearchComponent clearSearch={clearSearchMock} onSearch={onSearchMock} />,
    );
    const input = getByPlaceholderText('Search Pokémon name or ID');

    fireEvent.change(input, { target: { value: 'Pikachu' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearchMock).toHaveBeenCalledWith('Pikachu');
  });

  it('calls clearSearch when clear button is clicked', () => {
    const { getByPlaceholderText, getByAltText } = render(
      <SearchComponent clearSearch={clearSearchMock} onSearch={onSearchMock} />,
    );
    const input = getByPlaceholderText('Search Pokémon name or ID');

    fireEvent.change(input, { target: { value: 'Pikachu' } });
    fireEvent.click(getByAltText('close'));

    expect(clearSearchMock).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('does not call onSearch when other keys are pressed', () => {
    const { getByPlaceholderText } = render(
      <SearchComponent clearSearch={clearSearchMock} onSearch={onSearchMock} />,
    );
    const input = getByPlaceholderText('Search Pokémon name or ID');

    fireEvent.change(input, { target: { value: 'Pikachu' } });
    fireEvent.keyDown(input, { key: 'Space', code: 'Space' });

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it('does not render clear button when input is empty', () => {
    const { getByPlaceholderText, queryByAltText } = render(
      <SearchComponent clearSearch={clearSearchMock} onSearch={onSearchMock} />,
    );
    const input = getByPlaceholderText('Search Pokémon name or ID');

    fireEvent.change(input, { target: { value: '' } });

    expect(queryByAltText('close')).not.toBeInTheDocument();
  });
});
