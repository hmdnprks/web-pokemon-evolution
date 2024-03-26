import { BerryListAPIResponse, BerrySingleAPIResponse } from '@component/interfaces/berry';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  let url = `${process.env.API_URL}/berry`;
  if (limit && offset) {
    url += `?limit=${limit}&offset=${offset}`;
  }

  const res = await fetch(url);

  const data: BerryListAPIResponse = await res.json();

  const berryListWithDetails = await Promise.all(
    data.results.map(async (berry: any) => {
      const berryId = berry.url.split('/')[6];
      const berryRes = await fetch(`${process.env.API_URL}/berry/${berryId}`);
      const berryData: BerrySingleAPIResponse = await berryRes.json();
      const berryName = berryData.item.name;

      const imageBerry = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berryName}.png`;

      return {
        ...berry,
        id: berryId,
        firmness: berryData.firmness.name,
        imageUrl: imageBerry,
      };
    }),
  );

  return Response.json({ ...data, results: berryListWithDetails });
}
