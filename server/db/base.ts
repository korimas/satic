import { NeonQueryFunction } from '@neondatabase/serverless';

type ComparisonOperator = '=' | '!=' | '>' | '<' | '>=' | '<=';
type SetOperator = 'IN' | 'NOT IN';
type NullOperator = 'IS NULL' | 'IS NOT NULL';
type LikeOperator = 'LIKE';
type SqlOperator = ComparisonOperator | SetOperator | NullOperator | LikeOperator;

interface Condition {
    field: string;
    operator: SqlOperator;
    value: any;
    conjunction?: 'AND' | 'OR';
}

interface Sort {
    field: string;
    order: 'ASC' | 'DESC';
}

interface Page {
    index: number;
    size: number;
}

export interface Query {
    conditions?: Condition[];
    sort?: Sort;
    page?: Page;
    limit?: number;
}


export class Filter {
    protected query: Query;

    constructor(private db: BaseDB<any>) {
        this.query = {
            conditions: []
        }
    }

    public condition(field: string, operator: SqlOperator, value: any) {
        if (!this.query.conditions) {
            this.query.conditions = [];
        }

        this.query.conditions.push({
            field,
            operator,
            value,
        });
        return this;
    }

    public and() {
        if (!this.query.conditions) {
            return this
        }
        this.query.conditions[this.query.conditions.length - 1].conjunction = 'AND';
        return this;
    }

    public or() {
        if (!this.query.conditions) {
            return this
        }
        this.query.conditions[this.query.conditions.length - 1].conjunction = 'OR';
        return this;
    }

    public sort(field: string, order: 'ASC' | 'DESC') {
        this.query.sort = { field, order };
        return this;
    }

    public page(index: number, size: number) {
        this.query.page = { index, size };
        return this;
    }

    public limit(limit: number) {
        this.query.limit = limit;
        return this;
    }

    public async execute(sql: NeonQueryFunction<any, any>) {
        return await this.db.filterByQuery(sql, [this.query]);
    }
}

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

    public buildFilterSql(query: Query) {
        // TODO(important): 增加field的安全检查
        let whereClause = '';
        const values: any[] = [];

        // 1. 拼装条件  
        if (query.conditions && query.conditions.length > 0) {
            query.conditions.forEach((condition, index) => {
                if (index > 0) {
                    whereClause += ` ${condition.conjunction} `;
                }
                whereClause += `${condition.field} ${condition.operator} $${index + 1}`;
                values.push(condition.value);
            });
        }

        // 2. 在主查询文本中依次拼装各部分  
        let text = `SELECT * FROM ${this.tableName} `;

        if (whereClause) {
            text += `WHERE ${whereClause} `;
        }

        if (query.sort) {
            text += `ORDER BY ${query.sort.field} ${query.sort.order} `;
        }

        if (query.page) {
            text += `LIMIT ${query.page.size} OFFSET ${(query.page.index - 1) * query.page.size} `;
        } else if (query.limit) {
            text += `LIMIT ${query.limit} `;
        }

        console.log('query text:', text);
        return {
            text: text.trim(),  // 去除末尾空格  
            values
        };
    }

    public async filterByQuery(sql: NeonQueryFunction<any, any>, querys: Query[]): Promise<T[]> {
        let result: T[] = [];
        for (let query of querys) {
            const { text, values } = this.buildFilterSql(query);
            const r = await sql(text, values) as T[];
            result = result.concat(r);
        }
        return result;
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
        params?: Partial<T>,
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
        console.log('create sql:', text);
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

    public filter() {
        return new Filter(this);
    }
} 
