import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { types } from '@neondatabase/serverless';

types.setTypeParser(types.builtins.INT8, (val) => {
  return val === null ? null : parseInt(val, 10);
});

export abstract class BaseApiHandler {
  protected sql: NeonQueryFunction<any, any>;

  constructor() {
    // 构造函数
    if (!process.env.DATABASE_URL) {
      throw new Error(`Failed to get DATABASE_URL`);
    }

    this.sql = neon(process.env.DATABASE_URL);
  }

  protected abstract handleGet(req: Request): any;
  protected abstract handlePost(req: Request): any;
  protected abstract handleDelete(req: Request): any;

  public async handleRequest(req: Request): Promise<Response> {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(JSON.stringify({ Access: 'OPTIONS' }), {
        status: 200,
        // headers: this.getCorsHeaders(),
      });
    }

    try {
      //   const response = await this.routeRequest(req);
      //   return this.addCorsHeaders(response);
      const result = await this.routeRequest(req);
      return this.makeResponse(result, true);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      return this.makeResponse(null, false, -9999, errorMessage);
    }
  }

  private async routeRequest(req: Request) {
    switch (req.method) {
      case 'GET':
        return this.handleGet(req);
      case 'POST':
        return this.handlePost(req);
      case 'DELETE':
        return this.handleDelete(req);
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }
  }

  //   protected getCorsHeaders(): HeadersInit {
  //     return {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  //       'Access-Control-Allow-Headers': 'Content-Type',
  //       'Content-Type': 'application/json',
  //     };
  //   }

  //   protected addCorsHeaders(response: Response): Response {
  //     const newHeaders = new Headers(response.headers);
  //     Object.entries(this.getCorsHeaders()).forEach(([key, value]) => {
  //       newHeaders.set(key, value);
  //     });

  //     return new Response(response.body, {
  //       status: response.status,
  //       headers: newHeaders,
  //     });
  //   }

  protected makeResponse<T>(
    result: T,
    success: boolean,
    errorCode = 0,
    errorMessage = ''
  ): Response {
    return Response.json({
      result: result,
      success: success,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    });
  }
}
