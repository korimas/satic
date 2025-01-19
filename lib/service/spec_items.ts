import { BaseApiHandler } from './base';
import { SpecItemModel, SpecItemDBInstance } from '../db/spec_items';

const SequenceStep = 100;

export class SpecItemsHandler extends BaseApiHandler {
  protected async handleGet(req: Request) {
    //get query params
    const url = new URL(req.url);

    const query = url.searchParams.get('query');
    if (query) {
      // get list by query
      return await SpecItemDBInstance.filterByQuery(this.sql, JSON.parse(query));
    }

    const near_id = url.searchParams.get('near_id');
    if (near_id) {
      // get list by near_id
      return await SpecItemDBInstance.getSpecItemsByNearId(this.sql, near_id);
    }

    // get list
    const result = await SpecItemDBInstance.list(this.sql);
    return result;
  }


  protected async resortAllItems() {
    // TODO: 优化，不要每次都更新所有的item
    console.log('resortAllItems');
    let items = (await this
      .sql`SELECT * FROM spec_items ORDER BY sequence ASC`) as SpecItemModel[];
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

  protected async getSequence(type: string, ref_item: SpecItemModel) {
    switch (type) {
      case 'above':
        let ref_pre = await SpecItemDBInstance.getPrevItem(this.sql, ref_item.sequence);
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
        let pre_item = ref_item;
        let next_item = await SpecItemDBInstance.getNextItem(this.sql, ref_item.sequence, ref_item.depth);
        let belowSequence = 0;
        if (!next_item) {
          const lastItem = await SpecItemDBInstance.getTheLastItem(this.sql);
          if (!lastItem) {
            belowSequence = SequenceStep; // first item
          } else {
            belowSequence = lastItem.sequence + SequenceStep; // last item
          }
        } else {
          if (ref_item.has_children) {
            const lastChild = await SpecItemDBInstance.getTheLastChild(this.sql, ref_item.id);
            if (!lastChild) {
              throw new Error('No last child found');
            } else {
              pre_item = lastChild; // last child
            }
          }
          belowSequence = Math.floor(
            (pre_item.sequence + next_item.sequence) / 2
          ); // between

          if (
            belowSequence === pre_item.sequence ||
            belowSequence === next_item.sequence
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

  protected async handlePost(req: Request) {
    const payload = await req.json();
    console.log('payload:', payload);

    if (!payload.position || payload.position.item === -1) {
      // insert to root
      const lastItem = await SpecItemDBInstance.getLastItem(this.sql, 1);
      if (!lastItem) {
        // insert as first
        console.log('insert as first');
        let spec_item = payload.item;
        spec_item.sequence = SequenceStep;
        spec_item.path = '/';
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await SpecItemDBInstance.create(this.sql, spec_item);
      } else {
        console.log('insert as last, pre last:', lastItem);
        let spec_item = payload.item;
        spec_item.sequence = lastItem.sequence + SequenceStep;
        spec_item.path = '/';
        spec_item.depth = 1;
        spec_item.parent_id = null;
        spec_item.has_children = false;
        return await SpecItemDBInstance.create(this.sql, spec_item);
      }
    }
    console.log('insert as position');
    // get ref item
    let ref_item = await SpecItemDBInstance.get(this.sql, { id: payload.position.item });
    if (!ref_item) {
      throw new Error('Ref item not found');
    }

    let sequence = await this.getSequence(payload.position.type, ref_item);
    if (sequence === -1) {
      await this.resortAllItems();
      // 重新获取ref_item
      ref_item = await SpecItemDBInstance.get(this.sql, { id: payload.position.item });
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
      spec_item.path = `${ref_item.path}${ref_item.id}/`;
      spec_item.depth = ref_item.depth + 1;
      spec_item.parent_id = ref_item.id;
    }
    spec_item.has_children = false;
    let result = await SpecItemDBInstance.create(this.sql, spec_item);
    if (payload.position.type === 'child') {
      await this.setSpecHasChildren(ref_item.id);
    }
    return result;
  }

  protected async setSpecHasChildren(id: number) {
    await this.sql`UPDATE spec_items SET has_children = true WHERE id = ${id}`;
  }

  protected async moveItem(id: number, position: string, ref_item_id: number) {
    let item = await SpecItemDBInstance.get(this.sql, { id });
    if (!item) {
      throw new Error('Item not found');
    }
    const old_parent_id = item.parent_id;

    let ref_item = await SpecItemDBInstance.get(this.sql, { id: ref_item_id });
    if (!ref_item) {
      throw new Error('Ref item not found');
    }

    let sequence = await this.getSequence(position, ref_item);
    if (sequence === -1) {
      await this.resortAllItems();
      // 重新获取ref_item
      ref_item = await SpecItemDBInstance.get(this.sql, { id: ref_item_id });
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
      let children = await SpecItemDBInstance.list(this.sql, { parent_id: old_parent_id });
      if (children.length === 0) {
        await this
          .sql`UPDATE spec_items SET has_children = false WHERE id = ${item.parent_id}`;
      }
    }
  }

  protected async handleDelete(req: Request) {
    const payload = await req.json();

    if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
      throw new Error('Invalid ids array');
    }

    const result = await SpecItemDBInstance.batchDelete(this.sql, 'id', payload.ids);

    // const result = (await this.sql`
    //   DELETE FROM spec_items
    //   WHERE id = ANY(${payload.ids}::bigint[])
    //   AND has_children = false
    //   RETURNING id, parent_id
    //   `) as any[];

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

  protected async handlePut(req: Request) {
    const payload = await req.json();
    if (!payload.id) {
      throw new Error('Invalid id');
    }
    console.log('payload:', payload);

    const result = (await this.sql`  
      UPDATE spec_items  
      SET summary = ${payload.summary},   
          description = ${payload.description}  
      WHERE id = ${payload.id}  
      RETURNING *  
    `) as any[];

    if (result.length === 0) {
      throw new Error('Failed to update spec item');
    }
    return result[0];
  }
}
