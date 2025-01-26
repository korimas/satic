import { BaseApiHandler } from './base';
import { SpecsDBInstance } from '../db/specs';


export class SpecsHandler extends BaseApiHandler {

    protected async handleGet(req: Request) {
        //get query params
        const url = new URL(req.url);

        const query = url.searchParams.get('query');
        if (query) {
            // get list by query
            return await SpecsDBInstance.filterByQuery(this.sql, JSON.parse(query));
        }

        // get list
        const result = await SpecsDBInstance.list(this.sql);
        return result;
    }

    protected async handlePost(req: Request) {
        const payload = await req.json();
        return SpecsDBInstance.create(this.sql, payload);
    }

    protected async handleDelete(req: Request) {
        const payload = await req.json();

        if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
            throw new Error('Invalid ids array');
        }

        return await SpecsDBInstance.batchDelete(this.sql, 'id', payload.ids);
    }

    protected async handlePut(req: Request) {
        // const payload = await req.json();
        // return await SpecCommentDB.updateComment(this.sql, payload);
        return;
    }
}
