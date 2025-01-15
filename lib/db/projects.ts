import { BaseDB } from "./base";

export interface ProjectModel {
    id: string;
    key: string;
    name: string;
    desc: string;
}


export class ProjectsDB extends BaseDB<ProjectModel> {
    protected tableName = 'projects';

}
