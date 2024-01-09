import { PokemonListAPIResponse, PokemonSingleAPIResponse } from '@component/interfaces/pokemon';

export async function GET(request: Request) {
  const res = await fetch(`${process.env.API_URL}/pokemon`);
  const data: PokemonListAPIResponse = await res.json();

  const pokemonListWithDetails = await Promise.all(data.results.map(async (pokemon: any) => {
    const pokemonId = pokemon.url.split('/')[6];
    const pokemonRes = await fetch(`${process.env.API_URL}/pokemon/${pokemonId}`);
    const pokemonData: PokemonSingleAPIResponse = await pokemonRes.json();

    return {
      ...pokemon,
      id: pokemonId,
      imageUrl: {
        small: pokemonData.sprites.front_default,
        large: pokemonData.sprites.other['official-artwork'].front_default
      }
    };
  }));

  return Response.json({ ...data, results: pokemonListWithDetails });
}
