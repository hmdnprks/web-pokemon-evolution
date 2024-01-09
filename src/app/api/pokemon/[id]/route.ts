import { PokemonSingleAPIResponse } from '@component/interfaces/pokemon';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = `${process.env.API_URL}/pokemon/${params.id}`;
  const res = await fetch(url);
  const data: PokemonSingleAPIResponse = await res.json();

  const pokemonData = {
    id: data.id,
    name: data.name,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
      weight: data.weight,
    }
  };

  return Response.json({ data: pokemonData });
}
