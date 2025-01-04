export interface Project {
  id: string;
  key: string;
  name: string;
  desc: string;
  icon: string;
}

export interface Issue {
  id: number;
  key: string;
  project_id: string;
  issue_type: string;
  summary: string;
  description: string;
  priority: string;
  status: string;
  reporter_id: string;
  assignee_id: string;
  due_date: string;
  start_date: string;
  parent_issue_id: number;
  custom_fields: any;
  created_at: string;
  updated_at: string;
}

export interface SpecItem {
  id: number;
  key: string;
  project_id: string;
  spec_id: number;
  summary: string;
  description: string;
  priority: string;
  status: string;
  reporter_id: string;
  type: string;
  sequence: number;
  has_children: boolean;

  path: string;
  depth: number;
  parent_id: number;
  custom_fields: any;
  created_at: string;
  updated_at: string;

  // extra properties
  lazy?: boolean; // added lazy property
  children?: SpecItem[];
  expandable?: boolean;
  selectable?: boolean;
  isInEdit?: boolean;
}
