import { NeonQueryFunction } from '@neondatabase/serverless';

export abstract class BaseDB<T> {
    protected abstract tableName: string;

    protected buildQuery(
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
            query: `SELECT * FROM ${this.tableName} ${whereCmd} ${orderCmd} ${limitCmd} ${offsetCmd}`,
            values: values
        };
    }

    public async get(sql: NeonQueryFunction<any, any>, params: Partial<T> = {}): Promise<T | null> {
        const { query, values } = this.buildQuery(params);
        const result = await sql(query, values);

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
        const { query, values } = this.buildQuery(params, orderBy, orderType, offset, limit);
        return await sql(query, values) as T[];
    }

    protected async create(sql: NeonQueryFunction<any, any>, data: Partial<T>): Promise<T> {
        const result = (await sql`
            INSERT INTO ${sql(this.tableName)} (${sql(Object.keys(data).join(', '))})
            VALUES (${sql(Object.values(data).map(value => sql`${value}`).join(', '))})
            RETURNING *
        `) as T[];

        return result[0] as T;
    }
} 