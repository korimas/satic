import { BaseApiHandler } from './base';

export class IssuesHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      // get detail
      const result = await this.sql`SELECT * FROM issues WHERE id = ${id}`;
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error(`Issue not found: ${id}`);
      }
      return result[0];
    }
    // get list
    const result = await this.sql`SELECT * FROM issues`;
    return result;
  }

  protected async handlePost(req: Request) {
    const payload = await req.json();

    const result = (await this.sql`  
        INSERT INTO issues (key, issue_type, summary, reporter_id, description, status, priority, project_id)  
        VALUES ( ${payload.key} ,${payload.issue_type}, ${payload.summary}, ${payload.reporter_id}, ${payload.description}, ${payload.status}, ${payload.priority}, ${payload.project_id})  
        RETURNING *  
      `) as any[];

    // 判断成功
    if (result.length === 0) {
      throw new Error('Failed to insert issue');
    }
    return (result as any[])[0];
  }

  protected async handleDelete(req: Request) {
    const payload = await req.json();

    if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
      throw new Error('Invalid ids array');
    }

    const result = await this.sql`  
        DELETE FROM issues  
        WHERE id = ANY(${payload.ids}::uuid[])  
        RETURNING id  
      `;

    return result;
  }

  protected async handlePut(req: Request) {
    return
  }
}
