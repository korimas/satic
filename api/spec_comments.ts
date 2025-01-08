import { SpecCommentsHandler } from "../lib/service/spec_comments";
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  const handler = new SpecCommentsHandler();
  return handler.handleRequest(req);
};

export default handler;
