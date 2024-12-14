import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

function getDataBaseURL(): string {
  if (!process.env.DATABASE_URL) {
    throw new Error(`Failed to get DATABASE_URL`);
  }
  return process.env.DATABASE_URL;
}

const handler = async (req: Request): Promise<Response> => {
  // for CORS
  if (req.method === 'OPTIONS') {
    return new Response('{"Access": "OPTIONS"}', {
      status: 200,
    });
  }

  try {
    if (req.method === 'GET') {
      return await get_projects(req);
    }
    return new Response('{"error": "Method not allowed"}', {
      status: 405,
    });
  } catch (e) {
    console.error(e);
    return new Response('{"error": "Failed to query database"}', {
      status: 500,
    });
  }
};

async function get_projects(req: Request): Promise<Response> {
  const sql = neon(getDataBaseURL());
  const response = await sql`SELECT * FROM projects`;
  return Response.json({
    message: 'A Ok!',
    data: response,
  });
}
export default handler;
