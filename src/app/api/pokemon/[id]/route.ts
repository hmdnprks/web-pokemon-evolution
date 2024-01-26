import {
  PokemonSingleAPIResponse,
  EvolutionData,
  PokemonSpeciesAPIResponse,
} from '@component/interfaces/pokemon';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function extractEvolutionData(evolutionNode: any): EvolutionData | null {
  if (!evolutionNode) {
    return null;
  }

  const id = evolutionNode.species.url.split('/')[6];
  return {
    name: evolutionNode.species.name,
    url: evolutionNode.species.url,
    id: id,
    imageUrl: {
      small: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      large: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    },
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      weight: 0,
    },
  };
}

async function getNextEvolution(
  currentName: string,
  dataEvolution: any,
): Promise<EvolutionData | null> {
  let nextEvolutionNode = dataEvolution.chain;

  while (nextEvolutionNode && nextEvolutionNode.species.name !== currentName) {
    nextEvolutionNode = nextEvolutionNode.evolves_to[0];
  }

  const nextNode = nextEvolutionNode?.evolves_to[0];
  if (!nextNode) {
    return null;
  }

  const nextEvolution = extractEvolutionData(nextNode);
  if (!nextEvolution) {
    return null;
  }

  const nextEvolutionData: PokemonSingleAPIResponse = await fetchJson(
    `${process.env.API_URL}/pokemon/${nextEvolution.id}`,
  );
  nextEvolution.stats = {
    hp: nextEvolutionData.stats[0].base_stat,
    attack: nextEvolutionData.stats[1].base_stat,
    defense: nextEvolutionData.stats[2].base_stat,
    speed: nextEvolutionData.stats[5].base_stat,
    weight: nextEvolutionData.weight,
  };

  return nextEvolution;
}

async function getNextEvolutions(
  currentName: string,
  dataEvolution: any,
): Promise<EvolutionData[] | null> {
  let nextEvolutionNode = dataEvolution.chain;

  // Find the current evolution node
  while (nextEvolutionNode && nextEvolutionNode.species.name !== currentName) {
    if (nextEvolutionNode.evolves_to.length > 0) {
      nextEvolutionNode = nextEvolutionNode.evolves_to[0];
    } else {
      return null; // No further evolutions
    }
  }

  // Collect all next evolutions
  const nextEvolutions = [];
  for (const node of nextEvolutionNode.evolves_to) {
    const nextEvolution = extractEvolutionData(node);
    if (nextEvolution) {
      const nextEvolutionData: PokemonSingleAPIResponse = await fetchJson(
        `${process.env.API_URL}/pokemon/${nextEvolution.id}`,
      );
      nextEvolution.stats = {
        hp: nextEvolutionData.stats[0].base_stat,
        attack: nextEvolutionData.stats[1].base_stat,
        defense: nextEvolutionData.stats[2].base_stat,
        speed: nextEvolutionData.stats[5].base_stat,
        weight: nextEvolutionData.weight,
      };
      nextEvolutions.push(nextEvolution);
    }
  }

  return nextEvolutions.length > 0 ? nextEvolutions : null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const data: PokemonSingleAPIResponse = await fetchJson(
    `${process.env.API_URL}/pokemon/${params.id}`,
  );
  const dataSpecies: PokemonSpeciesAPIResponse = await fetchJson(data.species.url);
  const dataEvolution = await fetchJson(dataSpecies.evolution_chain.url);

  const nextEvolutions = await getNextEvolutions(data.name, dataEvolution);

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
    nextEvolutions,
  };

  return Response.json({ data: pokemonData });
}
