import { BerryListAPIResponse, BerrySingleAPIResponse } from '@component/interfaces/berry';

export async function GET(request: Request) {
  const res = await fetch(`${process.env.API_URL}/berry`);
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
