import { BaseApiHandler } from './base';

export class ProjectsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    const result = await this.sql`SELECT * FROM projects`;
    return result;
  }

  protected async handlePost(req: Request) {
    const payload = await req.json();

    const result = (await this.sql`  
        INSERT INTO projects (name, key, icon, description)  
        VALUES (${payload.name}, ${payload.key}, ${payload.icon}, ${payload.description})  
        RETURNING *  
      `) as any[];

    // 判断成功
    if (result.length === 0) {
      throw new Error('Failed to insert project');
    }
    return (result as any[])[0];
  }

  protected async handleDelete(req: Request) {
    const payload = await req.json();

    if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
      throw new Error('Invalid ids array');
    }

    const result = await this.sql`  
        DELETE FROM projects  
        WHERE id = ANY(${payload.ids}::uuid[])  
        RETURNING id  
      `;

    return result;
  }
}
