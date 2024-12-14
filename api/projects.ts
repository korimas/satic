import { ProjectsHandler } from '../lib/service/projects';

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'iad1'],
};

const handler = async (req: Request): Promise<Response> => {
  const projectsHandler = new ProjectsHandler();
  return projectsHandler.handleRequest(req);
};

export default handler;
