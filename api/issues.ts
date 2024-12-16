import { IssuesHandler } from 'app/lib/service/issues';
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  return new IssuesHandler().handleRequest(req);
};

export default handler;
