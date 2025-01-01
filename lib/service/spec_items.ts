import { SpecItem } from 'src/data/structs';
import { BaseApiHandler } from './base';

const SequenceStep = 100;
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

    const parent_id = url.searchParams.get('parent_id');
    if (parent_id) {
      // get list by parent_id
      return await this.getSpecItemsByParentId(parent_id);
    }

    const near_id = url.searchParams.get('near_id');
    if (near_id) {
      // get list by near_id
      return await this.getSpecItemsByNearId(near_id);
    }

    const top = url.searchParams.get('top');
    if (top) {
      // get top list
      return await this.getTopSpecItems(Number(top));
    }

    const next = url.searchParams.get('next');
    if (next) {
      // get next item
      return await this.getNextPageItems(Number(next));
    }

    const prev = url.searchParams.get('prev');
    if (prev) {
      // get prev item
      return await this.getPrevPageItems(Number(prev));
    }

    // get list
    const result = await this.sql`SELECT * FROM spec_items`;
    return result;
  }

  protected async getNextPageItems(next: number) {
    const result = await this
      .sql`SELECT * FROM spec_items WHERE sequence > ${next} ORDER BY sequence ASC LIMIT 25`;
    if (!Array.isArray(result) || result.length === 0) {
      return [];
    }
    return result as SpecItem[];
  }

  protected async getPrevPageItems(prev: number) {
    const result = await this
      .sql`SELECT * FROM spec_items WHERE sequence < ${prev} ORDER BY sequence DESC LIMIT 25`;
    if (!Array.isArray(result) || result.length === 0) {
      return [];
    }
    return result as SpecItem[];
  }

  protected async getTopSpecItems(limit: number) {
    const result = await this
      .sql`SELECT * FROM spec_items ORDER BY sequence ASC LIMIT ${limit}`;
    if (!Array.isArray(result) || result.length === 0) {
      return [];
    }
    return result as SpecItem[];
  }

  protected async getSpecItemsByNearId(near_id: string) {
    const near = await this.getItem(near_id);
    if (!near) {
      throw new Error('Item not found');
    }
    // 查询near_id上面12条数据
    let above = await this.sql`SELECT * FROM spec_items WHERE sequence < 
      ${near.sequence} ORDER BY sequence DESC LIMIT 12`; // 12

    // 查询near_id下面12条数据
    let below = await this.sql`SELECT * FROM spec_items WHERE sequence > 
      ${near.sequence} ORDER BY sequence ASC LIMIT 12`; // 12
    if (!Array.isArray(above)) {
      above = [];
    }
    if (!Array.isArray(below)) {
      below = [];
    }
    const result = [...above.reverse(), near, ...below];
    return result as SpecItem[];
  }

  protected async getSpecItemsByParentId(parent_id: string) {
    const result = await this
      .sql`SELECT * FROM spec_items WHERE parent_id = ${parent_id} ORDER BY sequence ASC`;
    if (!Array.isArray(result) || result.length === 0) {
      return [];
    }
    return result as SpecItem[];
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

  protected async getNextItem(sequence: number, depth: number) {
    const next = await this
      .sql`SELECT * FROM spec_items WHERE sequence > ${sequence} and depth = ${depth} ORDER BY sequence ASC LIMIT 1`;
    if (!Array.isArray(next) || next.length === 0) {
      return null;
    }
    return next[0] as SpecItem;
  }

  protected async resortAllItems() {
    // TODO: 优化，不要每次都更新所有的item
    console.log('resortAllItems');
    let items = (await this
      .sql`SELECT * FROM spec_items ORDER BY sequence ASC`) as SpecItem[];
    console.log('items:', items);
    let sequence = 0;
    let failed = [];
    let last_failed_length = 0;
    let retry = 0;
    while (items.length > 0) {
      failed = []; // 清空failed数组

      for (const item of items) {
        try {
          if (retry === 0) {
            // 第一次重排，重新计算sequence
            sequence = sequence + SequenceStep;
            item.sequence = sequence;
          }
          await this
            .sql`UPDATE spec_items SET sequence = ${item.sequence} WHERE id = ${item.id}`;
        } catch (error) {
          failed.push(item);
        }
      }

      if (last_failed_length === failed.length) {
        // 无法更新，退出循环
        console.log('无法更新，退出循环');
        break;
      }
      last_failed_length = failed.length;
      items = failed;
      retry++;
    }
    console.log('success resort, retry count:', retry);
  }

  protected async getSequence(type: string, ref_item: SpecItem) {
    switch (type) {
      case 'above':
        let ref_pre = await this.getPrevItem(ref_item.sequence);
        let aboveSequence = 0;
        if (!ref_pre) {
          aboveSequence = Math.floor((ref_item.sequence + 0) / 2); // first item
          if (aboveSequence === ref_item.sequence) {
            // 已经没有空间插入新的item，需要重新排序
            return -1;
          }
        } else {
          aboveSequence = Math.floor(
            (ref_pre.sequence + ref_item.sequence) / 2
          ); // between
          if (
            aboveSequence === ref_pre.sequence ||
            aboveSequence === ref_item.sequence
          ) {
            // 已经没有空间插入新的item，需要重新排序
            return -1;
          }
        }
        console.log('aboveSequence:', aboveSequence);
        return aboveSequence;
      case 'below':
      case 'child':
        const ref_next = await this.getNextItem(ref_item.sequence, ref_item.depth);
        let belowSequence = 0;
        if (!ref_next) {
          belowSequence = ref_item.sequence + SequenceStep; // last item
        } else {
          belowSequence = Math.floor(
            (ref_item.sequence + ref_next.sequence) / 2
          ); // between

          if (
            belowSequence === ref_item.sequence ||
            belowSequence === ref_next.sequence
          ) {
            // 已经没有空间插入新的item，需要重新排序
            return -1;
          }
        }
        console.log('belowSequence:', belowSequence);
        return belowSequence;

      default:
        throw new Error('Invalid position type');
    }
  }

  protected async getTheLastChild(parent_id: number) {
    const last = await this
      .sql`SELECT * FROM spec_items WHERE parent_id = ${parent_id} ORDER BY sequence DESC LIMIT 1`;
    if (!Array.isArray(last) || last.length === 0) {
      return null;
    }
    return last[0] as SpecItem
  }

  protected async handlePost(req: Request) {
    const payload = await req.json();
    console.log('payload:', payload);

    if (!payload.position || payload.position.item === -1) {
      // insert to root
      const lastItem = await this.getLastItem(1);
      if (!lastItem) {
        // insert as first
        console.log('insert as first');
        let spec_item = payload.item;
        spec_item.sequence = SequenceStep;
        spec_item.path = '/';
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await this.createSpecItem(spec_item);
      } else {
        console.log('insert as last, pre last:', lastItem);
        let spec_item = payload.item;
        spec_item.sequence = lastItem.sequence + SequenceStep;
        spec_item.path = '/';
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
    if (sequence === -1) {
      await this.resortAllItems();
      // 重新获取ref_item
      ref_item = await this.getItem(payload.position.item);
      if (!ref_item) {
        throw new Error('Ref item not found');
      }
      sequence = await this.getSequence(payload.position.type, ref_item);
    }
    if (sequence === -1) {
      throw new Error('No space to insert new item');
    }
    let spec_item = payload.item;
    spec_item.sequence = sequence;
    spec_item.path = ref_item.path;
    spec_item.depth = ref_item.depth;
    spec_item.parent_id = ref_item.parent_id || 0;

    if (payload.position.type === 'child') {
      spec_item.path = `${ref_item.path}/${ref_item.id}`;
      spec_item.depth = ref_item.depth + 1;
      spec_item.parent_id = ref_item.id;
    }
    spec_item.has_children = false;
    let result = await this.createSpecItem(spec_item);
    if (payload.position.type === 'child') {
      await this.setSpecHasChildren(ref_item.id);
    }
    return result;
  }

  protected async setSpecHasChildren(id: number) {
    await this.sql`UPDATE spec_items SET has_children = true WHERE id = ${id}`;
  }

  protected async moveItem(id: number, position: string, ref_item_id: number) {
    let item = await this.getItem(id.toString());
    if (!item) {
      throw new Error('Item not found');
    }
    const old_parent_id = item.parent_id;

    let ref_item = await this.getItem(ref_item_id.toString());
    if (!ref_item) {
      throw new Error('Ref item not found');
    }

    let sequence = await this.getSequence(position, ref_item);
    if (sequence === -1) {
      await this.resortAllItems();
      // 重新获取ref_item
      ref_item = await this.getItem(ref_item_id.toString());
      if (!ref_item) {
        throw new Error('Ref item not found');
      }
      sequence = await this.getSequence(position, ref_item);
    }
    if (sequence === -1) {
      throw new Error('No space to insert new item');
    }

    item.sequence = sequence;
    item.path = ref_item.path;
    item.depth = ref_item.depth;
    item.parent_id = ref_item.parent_id || 0;

    if (position === 'child') {
      item.path = `${ref_item.path}/${ref_item.id}`;
      item.depth = ref_item.depth + 1;
      item.parent_id = ref_item.id;
    }
    await this
      .sql`UPDATE spec_items SET sequence = ${item.sequence}, path = ${item.path}, depth = ${item.depth}, 
      parent_id = ${item.parent_id} WHERE id = ${id}`;

    // 更新ref_item的has_children状态
    if (position === 'child') {
      await this.setSpecHasChildren(ref_item.id);
    }

    // 更新原来的parent item的has_children状态
    if (item.parent_id) {
      let children = await this.getSpecItemsByParentId(
        old_parent_id.toString()
      );
      if (children.length === 0) {
        await this
          .sql`UPDATE spec_items SET has_children = false WHERE id = ${item.parent_id}`;
      }
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

    const result = (await this.sql`
      DELETE FROM spec_items
      WHERE id = ANY(${payload.ids}::bigint[])
      AND has_children = false
      RETURNING id, parent_id
      `) as any[];

    console.log('result:', result);
    const deletedIds = result.map(
      (item: { id: number; parent_id: number }) => item.id
    );
    const parentIds = result.map(
      (item: { id: number; parent_id: number }) => item.parent_id
    );

    console.log('deletedIds:', deletedIds);
    console.log('parentIds:', parentIds);
    // Update parent items' has_children status
    for (const parentId of parentIds) {
      if (parentId) {
        const children = (await this.sql`
          SELECT id FROM spec_items WHERE parent_id = ${parentId}
        `) as any[];
        console.log('children:', children);
        if (children.length === 0) {
          await this.sql`
            UPDATE spec_items SET has_children = false WHERE id = ${parentId}
          `;
        }
      }
    }

    return deletedIds;
  }
}
