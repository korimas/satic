import { NeonQueryFunction } from '@neondatabase/serverless';

export abstract class BaseDB<T> {
    protected abstract tableName: string;

    protected buildQuerySql(
        params?: Partial<T>,
        orderBy?: keyof T,
        orderType?: 'ASC' | 'DESC',
        offset?: number,
        limit?: number
    ) {
        const conditions: string[] = [];
        const values: any[] = [];
        orderType = orderType || 'ASC';

        const orderCmd = orderBy ? `ORDER BY ${String(orderBy)} ${orderType}` : '';
        const limitCmd = limit ? `LIMIT ${limit}` : '';
        const offsetCmd = offset ? `OFFSET ${offset}` : '';

        let whereCmd = ''
        if (params) {
            Object.entries(params)
                .filter(([_, value]) => value !== undefined)
                .forEach(([key, value]) => {
                    conditions.push(`${key} = $${conditions.length + 1}`);
                    values.push(value);
                });

            whereCmd = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        }
        return {
            text: `SELECT * FROM ${this.tableName} ${whereCmd} ${orderCmd} ${limitCmd} ${offsetCmd}`,
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
        console.log('text:', text);
        console.log('values:', values);
        const result = (await sql(text, values)) as T[];

        return result[0] as T;
    }
} 