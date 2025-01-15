import { NeonQueryFunction } from '@neondatabase/serverless';

export abstract class BaseDB<T> {
    protected abstract tableName: string;

    // 通用查询方法  
    public async get(sql: NeonQueryFunction<any, any>, params: Partial<T> = {}): Promise<T | null> {

        const conditions = Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key} = ${sql`${value}`}`)
            .join(' AND ');

        const whereClause = conditions ? `WHERE ${conditions}` : '';

        const result = await sql`  
            SELECT * FROM ${sql(this.tableName)}   
            ${sql(whereClause)}   
            ORDER BY created_at DESC  
        `;

        if (!Array.isArray(result) || result.length === 0) {
            return null
        }

        return result[0] as T;
    }

    public async list(sql: NeonQueryFunction<any, any>, params: Partial<T> = {}): Promise<T[]> {
        const conditions = Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key} = ${sql`${value}`}`)
            .join(' AND ');

        const whereClause = conditions ? `WHERE ${conditions}` : '';

        const result = await sql`  
            SELECT * FROM ${sql(this.tableName)}   
            ${sql(whereClause)}   
            ORDER BY created_at DESC  
        `;

        return result as T[];
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