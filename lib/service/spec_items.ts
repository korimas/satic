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
    console.log('payload:', payload);

    if (!payload.position || payload.position.sequence === -1) {
      // insert as last
      const last = await this
        .sql`SELECT * FROM spec_items WHERE depth = 1 ORDER BY sequence DESC LIMIT 1`;
      if (!Array.isArray(last) || last.length === 0) {
        // insert as first
        console.log('insert as first');
        let spec_item = payload.spec_item;
        spec_item.sequence = 100;
        spec_item.path = '100';
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await this.createSpecItem(spec_item);
      }
      console.log('insert as last');
    }
  }

  protected async createSpecItem(spec_item: any) {
    const result = (await this.sql`  
      INSERT INTO spec_items (key, type, summary, reporter_id, spec_id, description, status, priority, project_id, path, depth, parent_id, sequence, has_children)  
      VALUES ( ${spec_item.key} ,${spec_item.type}, ${spec_item.summary}, ${spec_item.reporter_id}, ${spec_item.spec_id},  ${spec_item.description}, 
      ${spec_item.status}, ${spec_item.priority}, ${spec_item.project_id}, ${spec_item.path}, ${spec_item.depth}, ${spec_item.parent_id},
      ${spec_item.sequence}, ${spec_item.has_children} )  
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
