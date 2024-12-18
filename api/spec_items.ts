import { SpecItemsHandler } from '../lib/service/spec_items';
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  const handler = new SpecItemsHandler();
  return handler.handleRequest(req);
};

export default handler;
