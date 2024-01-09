import { PokemonSingleAPIResponse } from '@component/interfaces/pokemon';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = `${process.env.API_URL}/pokemon/${params.id}`;
  const res = await fetch(url);
  const data: PokemonSingleAPIResponse = await res.json();

  const guessChainEvolutionId = Math.ceil(Number(params.id) / 3);

  const evolutionRes = await fetch(`${process.env.API_URL}/evolution-chain/${guessChainEvolutionId}`);
  const dataEvolution = await evolutionRes.json();

  let nextEvolution;
  if (dataEvolution.chain.species.name === data.name) {
    nextEvolution = {
      name: dataEvolution.chain.evolves_to[0].species.name,
      url: dataEvolution.chain.evolves_to[0].species.url,
      id: dataEvolution.chain.evolves_to[0].species.url.split('/')[6],
      imageUrl: {
        small: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dataEvolution.chain.evolves_to[0].species.url.split('/')[6]}.png`,
        large: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dataEvolution.chain.evolves_to[0].species.url.split('/')[6]}.png`
      }
    };
  } else if (dataEvolution.chain.evolves_to[0].species.name === data.name) {
    nextEvolution = {
      name: dataEvolution.chain.evolves_to[0].evolves_to[0].species.name,
      url: dataEvolution.chain.evolves_to[0].evolves_to[0].species.url,
      id: dataEvolution.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6],
      imageUrl: {
        small: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dataEvolution.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6]}.png`,
        large: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dataEvolution.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6]}.png`
      }
    };
  } else {
    nextEvolution = null;
  }

  const nextEvolutionRes = await fetch(`${process.env.API_URL}/pokemon/${nextEvolution?.id}`);
  const nextEvolutionData: PokemonSingleAPIResponse = await nextEvolutionRes.json();

  nextEvolution = {
    ...nextEvolution,
    stats: {
      hp: nextEvolutionData.stats[0].base_stat,
      attack: nextEvolutionData.stats[1].base_stat,
      defense: nextEvolutionData.stats[2].base_stat,
      speed: nextEvolutionData.stats[5].base_stat,
      weight: nextEvolutionData.weight,
    }
  };


  const pokemonData = {
    id: data.id,
    name: data.name,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
      weight: data.weight,
    },
    nextEvolution
  };

  return Response.json({ data: pokemonData });
}
