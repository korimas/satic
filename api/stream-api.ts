import { RequestStream, GPTAPIMessage, GPTAPIRequest } from '../lib/openai/api';

export const config = {
  runtime: 'edge'
};

const handler = async (req: Request): Promise<Response> => {

  // for CORS
  if (req.method === 'OPTIONS') {
    return new Response('{"Access": "OPTIONS"}', {
      status: 200
    });
  }

  const recvPayload = await req.json()
  const defaultModel = process.env.OPENAI_API_MODEL ?? 'gpt-3.5-turbo'
  const payload: GPTAPIRequest = {
    model: recvPayload.model ?? defaultModel,
    messages: recvPayload.messages,
    temperature: recvPayload.temperature,
    stream: true,
  };

  const stream = await RequestStream(payload);
  return new Response(stream);
};

export default handler;
