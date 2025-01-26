import { BaseDB } from "./base";

export interface ProjectModel {
    id: string;
    key: string;
    name: string;
    icon: string;
    description: string;
}


export class ProjectsDB extends BaseDB<ProjectModel> {
    protected tableName = 'projects';

}

export const ProjectsDBInstance = new ProjectsDB();