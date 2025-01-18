import { BaseDB } from "./base";
import { NeonQueryFunction } from '@neondatabase/serverless';

export interface SpecItemModel {
    id: number;
    key: string;
    project_id: string;
    spec_id: number;
    summary: string;
    description: string;
    priority: string;
    status: string;
    reporter_id: string;
    type: string;
    sequence: number;
    has_children: boolean;

    path: string;
    depth: number;
    parent_id: number;
    custom_fields: any;
    created_at: string;
    updated_at: string;
}

export class SpecItemDB extends BaseDB<SpecItemModel> {
    protected tableName = 'spec_items';

    public async getNextPageItems(sql: NeonQueryFunction<any, any>, next: number, limit: number = 25) {
        const result = await sql`SELECT * FROM spec_items WHERE sequence > ${next} ORDER BY sequence ASC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItemModel[];
    }

    public async getPrevPageItems(sql: NeonQueryFunction<any, any>, prev: number, limit: number = 25) {
        const result = await sql`SELECT * FROM spec_items WHERE sequence < ${prev} ORDER BY sequence DESC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItemModel[];
    }

    public async getTopSpecItems(sql: NeonQueryFunction<any, any>, limit: number) {
        const result = await sql`SELECT * FROM spec_items ORDER BY sequence ASC LIMIT ${limit}`;
        if (!Array.isArray(result) || result.length === 0) {
            return [];
        }
        return result as SpecItemModel[];
    }

    public async getSpecItemsByNearId(sql: NeonQueryFunction<any, any>, near_id: string, limit: number = 12) {
        // TODO: 指定spec_id
        const near = await this.get(sql, { id: parseInt(near_id) });
        if (!near) {
            throw new Error('Item not found');
        }
        console.log('near:', near);
        // 查询near_id上面12条数据
        let above = await sql`SELECT * 
            FROM 
                ${this.tableName} 
            WHERE 
                sequence < ${near.sequence} AND
                spec_id = ${near.spec_id}
            ORDER BY sequence DESC
            LIMIT ${limit}`;

        // 查询near_id下面12条数据
        let below = await sql`SELECT * 
            FROM 
                ${this.tableName} 
            WHERE 
                sequence > ${near.sequence}  AND
                spec_id = ${near.spec_id}
            ORDER BY sequence ASC 
            LIMIT ${limit}`;

        if (!Array.isArray(above)) {
            above = [];
        }
        if (!Array.isArray(below)) {
            below = [];
        }
        const result = [...above.reverse(), near, ...below];
        return result as SpecItemModel[];
    }

}

export const SpecItemDBInstance = new SpecItemDB();