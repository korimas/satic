import { BaseApiHandler } from './base';
import { ProjectsDBInstance, ProjectModel } from '../db/projects';

export class ProjectsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      return ProjectsDBInstance.get(this.sql, { id });  // TODO: 单例模式
    }
    return ProjectsDBInstance.list(this.sql);
  }

  protected async handlePost(req: Request) {
    const payload = await req.json() as ProjectModel;
    return ProjectsDBInstance.create(this.sql, payload);
  }

  protected async handleDelete(req: Request) {
    const payload = await req.json();
    return ProjectsDBInstance.batchDelete(this.sql, 'id', payload.ids);
  }

  protected async handlePut(req: Request) {
    return
  }
}
