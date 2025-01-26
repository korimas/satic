import { SpecsHandler } from "../server/service/specs";
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  const handler = new SpecsHandler();
  return handler.handleRequest(req);
};

export default handler;
