
// {
// 	"conditions": [
// 		{"field": "name", "operator": "=", "value": "hello", "conjunction": "AND"},
// 		{"field": "parent_id", "operator": "=", "value": 31}
// 	],
// 	"sort": {"filed": "name", "order": "DESC"},
// 	// sort和limit二选一
// 	"page": {"index": 1, "size": 100},
// 	"limit": 20,
// }
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

    constructor() {
        this.query = {
            conditions: []
        };
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

    public build() {
        return this.query;
    }
}
// filter.condition('name', 'like', '张三').and().condition('age', '>', 18).or().sort('age', 'DESC').page(1, 10).limit(10)