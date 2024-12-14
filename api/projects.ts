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
    } else if (req.method === 'POST') {
      return await post_projects(req);
    } else if (req.method === 'DELETE') {
      return await delete_projects(req);
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

async function post_projects(req: Request): Promise<Response> {
  const sql = neon(getDataBaseURL());

  const reqPayload = await req.json();

  const result = await sql`  
      INSERT INTO projects (name, key, icon, description)  
      VALUES (${reqPayload.name}, ${reqPayload.name}, ${reqPayload.icon}, ${reqPayload.description})  
      RETURNING *  
    `;
  console.log('Inserted user:', result[0]);
  return Response.json({
    message: 'A Ok!',
    data: result[0],
  });
}

async function delete_projects(req: Request): Promise<Response> {
  const sql = neon(getDataBaseURL());
  const reqPayload = await req.json();
  console.log('reqPayload:', reqPayload);
  console.log(reqPayload.ids.length);

  // 验证输入
  if (reqPayload.ids.length === 0) {
    return new Response('{"error": "Invalid ids array"}', {
      status: 400,
    });
  }

  const result = await sql`  
      DELETE FROM projects   
      WHERE id = ANY(${reqPayload.ids}::uuid[])  
      RETURNING id  
    `;

  return Response.json({
    message: 'A Ok!',
    data: result,
  });
}

export default handler;
