import { IssuesHandler } from '../lib/service/issues';
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  const issuesHandler = new IssuesHandler();
  return issuesHandler.handleRequest(req);
};

export default handler;
