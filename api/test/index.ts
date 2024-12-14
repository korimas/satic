export const config = {
    runtime: 'edge',
    regions: ['sin1', 'iad1'],
  };
  
  const handler = async (req: Request): Promise<Response> => {
    return Response.json({
      url: req.url,
    });
  };
  
  export default handler;
  