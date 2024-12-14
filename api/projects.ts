import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

export const handler = async (req: Request): Promise<Response> => {
  // for CORS
  if (req.method === 'OPTIONS') {
    return new Response('{"Access": "OPTIONS"}', {
      status: 200,
    });
  }

  if (!process.env.DATABASE_URL) {
    return new Response('{"error": "Missing DATABASE_URL"}', {
      status: 500,
    });
  }
  console.log('start select');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT * FROM projects`;
    return Response.json({
      message: 'A Ok!',
      data: response,
    });
  } catch (e) {
    console.error(e);
    return new Response('{"error": "Failed to query database"}', {
      status: 500,
    });
  }
};
