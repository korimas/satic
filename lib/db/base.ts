import { NeonQueryFunction } from '@neondatabase/serverless';

export abstract class BaseDB<T> {
    protected abstract tableName: string;

    protected buildBatchDeleteSql(key: keyof T) {

        return `DELETE FROM ${this.tableName}
                WHERE ${String(key)} = ANY($1)
                RETURNING *`;
    }


    protected buildConditionSql(params?: Partial<T>) {

        if (!params) {
            return {
                where: '',
                values: []
            };
        }

        const conditions: string[] = [];
        const values: any[] = [];

        Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .forEach(([key, value]) => {
                conditions.push(`${key} = $${conditions.length + 1}`);
                values.push(value);
            });

        return {
            where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
            values: values
        };
    }

    protected buildQuerySql(
        params?: Partial<T>,
        orderBy?: keyof T,
        orderType?: 'ASC' | 'DESC',
        offset?: number,
        limit?: number
    ) {
        orderType = orderType || 'ASC';

        const orderCmd = orderBy ? `ORDER BY ${String(orderBy)} ${orderType}` : '';
        const limitCmd = limit ? `LIMIT ${limit}` : '';
        const offsetCmd = offset ? `OFFSET ${offset}` : '';
        const { where, values } = this.buildConditionSql(params);

        return {
            text: `SELECT * FROM ${this.tableName} ${where} ${orderCmd} ${limitCmd} ${offsetCmd}`,
            values: values
        };
    }

    protected buildCreateSql(data: Partial<T>) {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data).map((_, index) => `$${index + 1}`).join(', ');
        return {
            text: `INSERT INTO ${this.tableName} (${keys}) VALUES (${values}) RETURNING *`,
            values: Object.values(data)
        };
    }

    public async get(sql: NeonQueryFunction<any, any>, params: Partial<T> = {}): Promise<T | null> {
        const { text, values } = this.buildQuerySql(params);
        const result = await sql(text, values);

        if (!Array.isArray(result) || result.length === 0) {
            return null;
        }

        if (result.length > 1) {
            throw new Error(`More than one record found in ${this.tableName}`);
        }

        return result[0] as T;
    }

    public async list(
        sql: NeonQueryFunction<any, any>,
        params: Partial<T> = {},
        orderBy?: keyof T,
        orderType?: 'ASC' | 'DESC',
        offset?: number,
        limit?: number
    ): Promise<T[]> {
        const { text, values } = this.buildQuerySql(params, orderBy, orderType, offset, limit);
        return await sql(text, values) as T[];
    }

    public async create(sql: NeonQueryFunction<any, any>, data: Partial<T>): Promise<T> {
        const { text, values } = this.buildCreateSql(data);
        const result = await sql(text, values) as T[];

        return result[0] as T;
    }

    public async update(sql: NeonQueryFunction<any, any>, id: string, data: Partial<T>): Promise<T> {
        const keys = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(data);
        const result = await sql(`
            UPDATE ${this.tableName}
            SET ${keys}
            WHERE id = $${values.length + 1}
            RETURNING *
        `, [...values, id]) as T[];

        if (result.length === 0) {
            throw new Error(`Failed to update ${this.tableName}`);
        }
        return result[0] as T;
    }

    public async delete(sql: NeonQueryFunction<any, any>, params: Partial<T>): Promise<T[]> {

        const { where, values } = this.buildConditionSql(params);

        const result = await sql(`
            DELETE FROM ${this.tableName}
            ${where}
            RETURNING *
        `, values) as T[];

        return result;
    }

    public async batchDelete(sql: NeonQueryFunction<any, any>, key: keyof T, values: any[]): Promise<T[]> {

        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('Invalid values array');
        }

        const result = await sql(this.buildBatchDeleteSql(key), [values]) as T[];
        return result;
    }

    public async count(sql: NeonQueryFunction<any, any>, params?: Partial<T>): Promise<number> {
        const { where, values } = this.buildConditionSql(params);

        const result = await sql(`
            SELECT COUNT(*) FROM ${this.tableName}
            ${where}
        `, values) as Record<string, any>[];

        return parseInt(result[0].count, 10);
    }
} 