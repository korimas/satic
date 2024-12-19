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

export function getItemIcon(type: string) {
  switch (type) {
    case 'Folder':
      return 'folder';
    case 'Item':
      return 'tips_and_updates';
    default:
      return 'tips_and_updates';
  }
}

export class SpecTreeMenusAction {
  static InsertAbove = 'Insert above';
  static InsertBelow = 'Insert below';
  static InsertChild = 'Insert child';
  static Delete = 'Delete';
  static Create = 'Create';
}

export const SpecTreeItemMenus = [
  { name: SpecTreeMenusAction.InsertAbove, icon: 'arrow_upward' },
  { name: SpecTreeMenusAction.InsertBelow, icon: 'arrow_downward' },
  { name: SpecTreeMenusAction.InsertChild, icon: 'subdirectory_arrow_right' },
  { name: SpecTreeMenusAction.Delete, icon: 'delete' },
];

export const SpecTreeEmptyMenus = [
  { name: SpecTreeMenusAction.Create, icon: 'add_circle_outline' },
];
