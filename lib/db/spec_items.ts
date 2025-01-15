import { NeonQueryFunction } from '@neondatabase/serverless';
import { SpecItem } from 'src/data/structs';

export class SpecItemDB {

    static async getSpecItemsByParentId(sql: NeonQueryFunction<any, any>, parent_id: string) {
        const result = await sql`SELECT * FROM spec_items WHERE parent_id = ${parent_id} ORDER BY sequence ASC`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItem[];
    }

    static async getSpecItemById(sql: NeonQueryFunction<any, any>, id: string | number) {
        const result = await sql`SELECT * FROM spec_items WHERE id = ${id}`;
        if (!Array.isArray(result) || result.length === 0) {
            return null;
        }
        return result[0] as SpecItem;
    }

    static async getNextPageItems(sql: NeonQueryFunction<any, any>, next: number, limit: number = 25) {
        const result = await sql`SELECT * FROM spec_items WHERE sequence > ${next} ORDER BY sequence ASC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItem[];
    }

    static async getPrevPageItems(sql: NeonQueryFunction<any, any>, prev: number, limit: number = 25) {
        const result = await sql`SELECT * FROM spec_items WHERE sequence < ${prev} ORDER BY sequence DESC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItem[];
    }

    static async getTopSpecItems(sql: NeonQueryFunction<any, any>, limit: number) {
        const result = await sql`SELECT * FROM spec_items ORDER BY sequence ASC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItem[];
    }

    static async getSpecItemsByNearId(sql: NeonQueryFunction<any, any>, near_id: string, limit: number = 12) {
        const near = await SpecItemDB.getSpecItemById(sql, near_id);
        if (!near) {
            throw new Error('Item not found');
        }
        // 查询near_id上面12条数据
        let above = await sql`SELECT * FROM spec_items WHERE sequence < 
          ${near.sequence} ORDER BY sequence DESC LIMIT ${limit}`; // 12

        // 查询near_id下面12条数据
        let below = await sql`SELECT * FROM spec_items WHERE sequence > 
          ${near.sequence} ORDER BY sequence ASC LIMIT ${limit}`; // 12
        if (!Array.isArray(above)) {
            above = [];
        }
        if (!Array.isArray(below)) {
            below = [];
        }
        const result = [...above.reverse(), near, ...below];
        return result as SpecItem[];
    }

}