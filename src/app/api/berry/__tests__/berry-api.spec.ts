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

describe('Berry List API', () => {
  beforeAll(() => {
    jest.resetModules();
    process.env.API_URL = 'https://pokeapi.co/api/v2';
  });

  afterAll(() => {
    delete process.env.API_URL;
  });

  it('should return results', async () => {
    const res = await GET(new Request('localhost:3000/api/berry'));

    expect(res.status).toBe(200);
    const body = await readableStreamToString(res?.body as ReadableStream);
    const parsedBody = JSON.parse(body);
    expect(parsedBody.results).toHaveLength(20);
  });

  it('should correctly handle requests with limit and offset parameters', async () => {
    const limit = 10;
    const offset = 5;
    const requestUrl = `localhost:3000/api/berry?limit=${limit}&offset=${offset}`;
    const res = await GET(new Request(requestUrl));

    expect(res.status).toBe(200);

    const body = await readableStreamToString(res?.body as ReadableStream);
    const parsedBody = JSON.parse(body);

    expect(parsedBody.results).toHaveLength(limit);
  });
});
