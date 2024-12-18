export const IssueTypes = ['Bug', 'Task', 'Feature'];
export const IssueTypeStyle = {
  Bug: { icon: 'bug_report', color: 'red' },
  Task: { icon: 'task', color: 'blue' },
  Feature: { icon: 'add_box', color: 'green' },
};

export const SpecItemTypes = ['Folder', 'Item'];
export const SpecItemTypeStyle = {
  Folder: { icon: 'folder', color: 'blue' },
  Item: { icon: 'tips_and_updates', color: 'green' },
};

export class SpecTreeMenusAction {
  static InsertAbove = 'Insert above';
  static InsertBelow = 'Insert below';
  static InsertChild = 'Insert child';
  static Delete = 'Delete';
}

export const SpecTreeMenus = [
  { name: SpecTreeMenusAction.InsertAbove, icon: 'arrow_upward' },
  { name: SpecTreeMenusAction.InsertBelow, icon: 'arrow_downward' },
  { name: SpecTreeMenusAction.InsertChild, icon: 'subdirectory_arrow_right' },
  { name: SpecTreeMenusAction.Delete, icon: 'delete' },
];
