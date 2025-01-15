import { NeonQueryFunction } from '@neondatabase/serverless';

export abstract class BaseDB<T> {
    protected abstract tableName: string;

    public async get(sql: NeonQueryFunction<any, any>, params: Partial<T> = {}): Promise<T | null> {
        // 构建查询条件和参数数组  
        const conditions: string[] = [];
        const values: any[] = [];

        console.log('params:', params)
        Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .forEach(([key, value]) => {
                conditions.push(`${key} = $${conditions.length + 1}`);
                values.push(value);
            });

        console.log('conditions:', conditions)
        console.log('values:', values)
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        console.log('whereClause:', whereClause)

        // 使用 sql 标签模板构建查询  
        const result = sql(`  
            SELECT * FROM ${sql(this.tableName)}  
            ${sql(whereClause)}  
            ORDER BY created_at DESC  
        `, ...values);

        // 将值数组展开到查询中  
        console.log('result:', result)
        if (!Array.isArray(result) || result.length === 0) {
            return null;
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