/**
 * @jest-environment node
 */
import { GET } from '../route';

async function readableStreamToString(readableStream: ReadableStream) {
  const reader = readableStream.getReader();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: readDone } = await reader.read();
    if (readDone) {
      done = true;
    } else {
      result += new TextDecoder().decode(value);
    }
  }

  return result;
}

describe('Pokemon List API', () => {
  beforeAll(() => {
    jest.resetModules();
    process.env.API_URL = 'https://pokeapi.co/api/v2';
  });

  afterAll(() => {
    delete process.env.API_URL;
  });

  it('should return results', async () => {
    const res = await GET(new Request('localhost:3000/api/pokemon'));

    expect(res.status).toBe(200);
    const body = await readableStreamToString(res?.body as ReadableStream);
    // stringified JSON
    const parsedBody = JSON.parse(body);
    expect(parsedBody.results).toHaveLength(20);
  });

  it('should return results with keyword', async () => {
    const res = await GET(new Request('localhost:3000/api/pokemon?keyword=bulbasaur'));

    expect(res.status).toBe(200);
    const body = await readableStreamToString(res?.body as ReadableStream);
    // stringified JSON
    const parsedBody = JSON.parse(body);
    expect(parsedBody.results).toHaveLength(1);
  });

  it('should return results with limit and offset', async () => {
    const res = await GET(new Request('localhost:3000/api/pokemon?limit=10&offset=10'));

    expect(res.status).toBe(200);
    const body = await readableStreamToString(res?.body as ReadableStream);
    // stringified JSON
    const parsedBody = JSON.parse(body);
    expect(parsedBody.results).toHaveLength(10);
  });
});
