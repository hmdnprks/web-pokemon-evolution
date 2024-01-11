import { PokemonListAPIResponse, PokemonSingleAPIResponse } from '@component/interfaces/pokemon';

async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 404) {
      return { error: 'Not Found', statusCode: 404 };
    }
    return { error: 'An error occurred', statusCode: response.status };
  }
  const data = await response.json();
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  let url = `${process.env.API_URL}/pokemon`;
  if (keyword) {
    url += `/${keyword}`;
  } else if (limit && offset) {
    url += `?limit=${limit}&offset=${offset}`;
  }

  const res = await fetch(url);
  const data = await handleResponse(res);

  if (data.error) {
    return Response.json({ error: data.error }, { status: data.statusCode });
  }

  if (keyword) {
    const singleDataResult: PokemonSingleAPIResponse = data;
    return Response.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: singleDataResult.name,
          url: `${process.env.API_URL}/pokemon/${singleDataResult.id}`,
          id: singleDataResult.id,
          imageUrl: {
            small: singleDataResult.sprites.front_default,
            large: singleDataResult.sprites.other['official-artwork'].front_default,
          },
        },
      ],
    });
  } else {
    const multipleDataResult: PokemonListAPIResponse = data;
    const pokemonListWithDetails = await Promise.all(
      multipleDataResult.results.map(async (pokemon: any) => {
        const pokemonId = pokemon.url.split('/')[6];
        const pokemonRes = await fetch(`${process.env.API_URL}/pokemon/${pokemonId}`);
        const pokemonData = await handleResponse(pokemonRes);

        if (pokemonData.error) {
          return { ...pokemon, error: pokemonData.error };
        }

        return {
          ...pokemon,
          id: pokemonId,
          imageUrl: {
            small: pokemonData.sprites.front_default,
            large: pokemonData.sprites.other['official-artwork'].front_default,
          },
        };
      }),
    );

    return Response.json({ ...multipleDataResult, results: pokemonListWithDetails });
  }
}
