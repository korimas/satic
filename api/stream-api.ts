import {RequestStream, GPTAPIMessage, GPTAPIRequest} from '../lib/openai/api';

export const config = {
  runtime: 'edge',
  // https://vercel.com/docs/edge-network/regions#region-list
  regions: [
      'arn1',
      'bom1',
      'cdg1',
      'cle1',
      'cpt1',
      'dub1',
      'fra1',
      'gru1',
      // 'hkg1', ip blocked by openai
      'hnd1',
      'iad1',
      'icn1',
      'kix1',
      'lhr1',
      'pdx1',
      'sfo1',
      'sin1',
      'syd1',
  ],
};

const handler = async (req: Request): Promise<Response> => {
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
