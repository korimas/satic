import { BaseApiHandler } from './base';
// import { SpecCommentDB } from '../db/spec_comments';


export class SpecCommentsHandler extends BaseApiHandler {

  protected async handleGet(req: Request) {
    // //get query params
    // const url = new URL(req.url);
    // const id = url.searchParams.get('id');
    // if (id) {
    //   return SpecCommentDB.getCommentById(this.sql, parseInt(id));
    // }

    // const specItemId = url.searchParams.get('spec_item_id');
    // if (specItemId) {
    //   return SpecCommentDB.getCommentsBySpecItemId(this.sql, parseInt(specItemId));
    // }
    return null;
  }

  protected async handlePost(req: Request) {
    // const payload = await req.json();
    // return SpecCommentDB.createComment(this.sql, payload);
  }

  protected async handleDelete(req: Request) {
    // const payload = await req.json();

    // if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
    //   throw new Error('Invalid ids array');
    // }

    // return await SpecCommentDB.deleteComment(this.sql, payload.ids);
  }

  protected async handlePut(req: Request) {
    return
  }
}
