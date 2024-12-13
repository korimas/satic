import { SpecItem } from 'src/data/structs';
import { BaseApiHandler } from './base';

export class SpecItemsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      // get detail
      return await this.getSpecItem(id);
    }

    const depth = url.searchParams.get('depth');
    if (depth) {
      // get list by depth
      return await this.getRootItems();
    }

    // get list
    const result = await this.sql`SELECT * FROM spec_items`;
    return result;
  }

  protected async getSpecItem(id: string) {
    const result = await this.sql`SELECT * FROM spec_items WHERE id = ${id}`;
    if (!Array.isArray(result) || result.length === 0) {
      return null;
    }
    return result[0] as SpecItem;
  }

  protected async getRootItems() {
    const result = await this
      .sql`SELECT * FROM spec_items WHERE depth = 1 ORDER BY sequence ASC`;
    if (!Array.isArray(result) || result.length === 0) {
      return [];
    }
    return result as SpecItem[];
  }

  protected async getLastItem(depth: number) {
    const last = await this
      .sql`SELECT * FROM spec_items WHERE depth = ${depth} ORDER BY sequence DESC LIMIT 1`;
    if (!Array.isArray(last) || last.length === 0) {
      return null;
    }
    return last[0] as SpecItem;
  }

  protected async getItem(id: string) {
    const result = await this.sql`SELECT * FROM spec_items WHERE id = ${id}`;
    if (!Array.isArray(result) || result.length === 0) {
      return null;
    }
    return result[0] as SpecItem;
  }

  protected async getPrevItem(sequence: number) {
    const pre = await this
      .sql`SELECT * FROM spec_items WHERE sequence < ${sequence} ORDER BY sequence DESC LIMIT 1`;
    if (!Array.isArray(pre) || pre.length === 0) {
      return null;
    }
    return pre[0] as SpecItem;
  }

  protected async getNextItem(sequence: number) {
    const next = await this
      .sql`SELECT * FROM spec_items WHERE sequence > ${sequence} ORDER BY sequence ASC LIMIT 1`;
    if (!Array.isArray(next) || next.length === 0) {
      return null;
    }
    return next[0] as SpecItem;
  }

  protected async getSequence(type: string, ref_item: SpecItem) {
    switch (type) {
      case 'above':
        let ref_pre = await this.getPrevItem(ref_item.sequence);
        let aboveSequence = 0;
        if (!ref_pre) {
          aboveSequence = (ref_item.sequence + 0) / 2;
        } else {
          aboveSequence = (ref_pre.sequence + ref_item.sequence) / 2;
        }
        return aboveSequence;
      case 'below':
      case 'child':
        let ref_next = await this.getNextItem(ref_item.sequence);
        let belowSequence = 0;
        if (!ref_next) {
          belowSequence = ref_item.sequence + 100;
        } else {
          belowSequence = (ref_item.sequence + ref_next.sequence) / 2;
        }
        return belowSequence;

      default:
        throw new Error('Invalid position type');
    }
  }

  protected async handlePost(req: Request) {
    const payload = await req.json();
    console.log('payload:', payload);

    if (!payload.position || payload.position.item === -1) {
      // insert as last
      const lastItem = await this.getLastItem(1);
      if (!lastItem) {
        // insert as first
        console.log('insert as first');
        let spec_item = payload.item;
        spec_item.sequence = 100;
        spec_item.path = '100';
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await this.createSpecItem(spec_item);
      } else {
        console.log('insert as last, pre last:', lastItem);
        let spec_item = payload.item;
        spec_item.sequence = lastItem.sequence + 100;
        spec_item.path = spec_item.sequence.toString();
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await this.createSpecItem(spec_item);
      }
    }
    console.log('insert as position');
    // get ref item
    let ref_item = await this.getItem(payload.position.item);
    if (!ref_item) {
      throw new Error('Ref item not found');
    }

    let sequence = await this.getSequence(payload.position.type, ref_item);
    let spec_item = payload.item;
    spec_item.sequence = sequence;
    spec_item.path = ref_item.path;
    spec_item.depth = ref_item.depth;
    spec_item.parent_id = ref_item.parent_id;

    if (payload.position.type === 'child') {
      spec_item.path = `${ref_item.path}.${sequence}`;
      spec_item.depth = ref_item.depth + 1;
      spec_item.parent_id = ref_item.id;
    }
    spec_item.has_children = false;
    let result = await this.createSpecItem(spec_item);
    await this.setSpecHasChildren(ref_item.id);
    return result;
  }

  protected async setSpecHasChildren(id: number) {
    await this.sql`UPDATE spec_items SET has_children = true WHERE id = ${id}`;
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
