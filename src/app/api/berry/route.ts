import { BerryListAPIResponse, BerrySingleAPIResponse, ItemAPIResponse } from '@component/interfaces/berry';

export async function GET(request: Request) {
  const res = await fetch(`${process.env.API_URL}/berry`);
  const data: BerryListAPIResponse = await res.json();

  const berryListWithDetails = await Promise.all(data.results.map(async (berry: any) => {
    const berryId = berry.url.split('/')[6];
    const berryRes = await fetch(`${process.env.API_URL}/berry/${berryId}`);
    const berryData: BerrySingleAPIResponse = await berryRes.json();

    const itemRes = await fetch(`${process.env.API_URL}/item/${berryData.item.url.split('/')[6]}`);
    const itemData: ItemAPIResponse = await itemRes.json();

    return {
      ...berry,
      id: berryId,
      firmness: berryData.firmness.name,
      imageUrl: itemData.sprites.default
    };
  }));

  return Response.json({ ...data, results: berryListWithDetails });
}
