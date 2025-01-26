import { BaseDB } from "./base";

export interface SpecModel {
    id: number;
    title: string;
    project_id: string;

    created_at: string;
    updated_at: string;
}


export class SpecsDB extends BaseDB<SpecModel> {
    protected tableName = 'specs';
}

export const SpecsDBInstance = new SpecsDB();