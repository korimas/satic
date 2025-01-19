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

    public async getSpecItemsByNearId(sql: NeonQueryFunction<any, any>, near_id: string, limit: number = 12) {
        // TODO: 指定spec_id
        const near = await this.get(sql, { id: parseInt(near_id) });
        if (!near) {
            throw new Error('Item not found');
        }
        console.log('near:', near);
        // 查询near_id上面12条数据
        let above = await sql(`SELECT * 
            FROM 
                ${this.tableName} 
            WHERE 
                sequence < $1 AND
                spec_id = $2
            ORDER BY sequence DESC
            LIMIT ${limit}`, [near.sequence, near.spec_id]) as SpecItemModel[];

        // 查询near_id下面12条数据
        let below = await sql(`SELECT * 
            FROM 
                ${this.tableName} 
            WHERE 
                sequence > $1  AND
                spec_id = $2
            ORDER BY sequence ASC 
            LIMIT ${limit}`, [near.sequence, near.spec_id]) as SpecItemModel[];

        if (!Array.isArray(above)) {
            above = [];
        }
        if (!Array.isArray(below)) {
            below = [];
        }
        const result = [...above.reverse(), near, ...below];
        return result as SpecItemModel[];
    }

    public async getLastItem(sql: NeonQueryFunction<any, any>, depth: number) {
        const last = await this.list(sql, { depth: depth }, 'sequence', 'DESC', undefined, 1)
        if (!Array.isArray(last) || last.length === 0) {
            return null;
        }
        return last[0] as SpecItemModel;
    }

    public async getPrevItem(sql: NeonQueryFunction<any, any>, sequence: number) {
        const pre = await sql(`SELECT * FROM ${this.tableName} WHERE sequence < ${sequence} ORDER BY sequence DESC LIMIT 1`);

        if (!Array.isArray(pre) || pre.length === 0) {
            return null;
        }
        return pre[0] as SpecItemModel;
    }

    public async getNextItem(sql: NeonQueryFunction<any, any>, sequence: number, depth: number) {
        const next = await sql(`SELECT * FROM ${this.tableName} WHERE sequence > ${sequence} and depth = ${depth} ORDER BY sequence ASC LIMIT 1`);
        if (!Array.isArray(next) || next.length === 0) {
            return null;
        }
        return next[0] as SpecItemModel;
    }

    public async getTheLastChild(sql: NeonQueryFunction<any, any>, parent_id: number) {
        const last = await sql`SELECT * FROM ${this.tableName} WHERE parent_id = ${parent_id} ORDER BY sequence DESC LIMIT 1`;
        if (!Array.isArray(last) || last.length === 0) {
            return null;
        }
        return last[0] as SpecItemModel
    }

    public async getTheLastItem(sql: NeonQueryFunction<any, any>) {
        const last = await sql`SELECT * FROM ${this.tableName} ORDER BY sequence DESC LIMIT 1`;
        if (!Array.isArray(last) || last.length === 0) {
            return null;
        }
        return last[0] as SpecItemModel;
    }


}

export const SpecItemDBInstance = new SpecItemDB();