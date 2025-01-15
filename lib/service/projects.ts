import { BaseApiHandler } from './base';
import { ProjectsDB, ProjectModel } from '../db/projects';

export class ProjectsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      return new ProjectsDB().get(this.sql, { id });  // TODO: 单例模式
    }

    return new ProjectsDB().list(this.sql);
  }

  protected async handlePost(req: Request) {
    const payload = await req.json() as ProjectModel;

    // const result = (await this.sql`  
    //     INSERT INTO projects (name, key, icon, description)  
    //     VALUES (${payload.name}, ${payload.key}, ${payload.icon}, ${payload.description})  
    //     RETURNING *  
    //   `) as any[];

    // // 判断成功
    // if (result.length === 0) {
    //   throw new Error('Failed to insert project');
    // }
    // return (result as any[])[0];

    return new ProjectsDB().create(this.sql, payload);
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

  protected async handlePut(req: Request) {
    return
  }
}
