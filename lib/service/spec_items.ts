import { BaseApiHandler } from './base';

export class SpecItemsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      // get detail
      const result = await this.sql`SELECT * FROM spec_items WHERE id = ${id}`;
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error(`Spec item not found: ${id}`);
      }
      return result[0];
    }
    // get list
    const result = await this.sql`SELECT * FROM spec_items`;
    return result;
  }

  protected async handlePost(req: Request) {
    const payload = await req.json();

    const result = (await this.sql`  
        INSERT INTO spec_items (key, type, summary, reporter_id, spec_id, description, status, priority, project_id, path, depth, parent_id)  
        VALUES ( ${payload.key} ,${payload.type}, ${payload.summary}, ${payload.reporter_id}, ${payload.spec_id}, ${payload.description}, ${payload.status}, ${payload.priority}, ${payload.project_id}, ${payload.path}, ${payload.depth}, ${payload.parent_id})  
        RETURNING *  
      `) as any[];

    // 判断成功
    if (result.length === 0) {
      throw new Error('Failed to insert spec item');
    }
    return (result as any[])[0];
  }

  protected async handleDelete(req: Request) {
    const payload = await req.json();

    if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
      throw new Error('Invalid ids array');
    }

    const result = await this.sql`  
        DELETE FROM spec_items  
        WHERE id = ANY(${payload.ids}::uuid[])  
        RETURNING id  
      `;

    return result;
  }
}
