import API from 'src/api/satic';
import { SpecItem } from 'src/data/structs';
import { SpecPositionType } from 'src/data/constances';

export class SpecTree {
  public treeNodes: any[];
  public nodesMap: Map<number, SpecItem>;

  constructor() {
    this.treeNodes = [];
    this.nodesMap = new Map<number, SpecItem>();
  }

  public reformatSpec(spec: SpecItem) {
    spec.lazy = spec.has_children;
    spec.key = spec.id.toString();
  }

  public async init() {
    await this.loadRootSpecs();
  }

  public async loadRootSpecs() {
    const resp = await API.getSpecRootItems();
    if (resp.success) {
      const specs = resp.result;
      this.nodesMap = new Map<number, SpecItem>();
      this.treeNodes = [];
      specs.forEach((spec: SpecItem) => {
        this.reformatSpec(spec);
        this.nodesMap.set(spec.id, spec);
        this.treeNodes.push(spec);
      });
    }
  }

  public findNodeById(id: number) {
    return this.nodesMap.get(id);
  }

  public findNodeByKey(key: string) {
    return this.nodesMap.get(parseInt(key));
  }

  public async loadChildren(key: string) {
    const resp = await API.getSpecChildItems(key);
    if (resp.success) {
      const children = resp.result;
      if (!children) {
        return;
      }
      children.forEach((child: SpecItem) => {
        this.reformatSpec(child);
        this.nodesMap.set(child.id, child);
      });

      const node = this.findNodeByKey(key);
      if (node) {
        node.children = children;
        node.lazy = false;
      }
    }
  }

  public async createSpecItem(
    positionType: SpecPositionType,
    refItemID: number,
    newItem: SpecItem
  ) {
    const data = {
      position: {
        type: positionType,
        item: refItemID,
      },
      item: newItem,
    };
    const resp = await API.createSpecItem(data);
    if (resp.success) {
      const created = resp.result;
      this.reformatSpec(created);
      this.updateTreeAfterCreate(positionType, refItemID, created);

      return true;
    }
    return false;
  }

  public updateTreeAfterCreate(
    positionType: SpecPositionType,
    refItemID: number,
    createdItem: SpecItem
  ) {
    console.log('updateTreeAfterCreate', positionType, refItemID, createdItem);
    const refNode = this.findNodeById(refItemID);
    if (!refNode) {
      return;
    }
    switch (positionType) {
      case SpecPositionType.Above:
      case SpecPositionType.Below:
        if (refNode.parent_id === 0) {
          const index = this.treeNodes.indexOf(refNode);
          if (positionType === SpecPositionType.Below) {
            this.treeNodes.splice(index + 1, 0, createdItem);
          } else {
            this.treeNodes.splice(index, 0, createdItem);
          }
          break;
        }

        const parent = this.findNodeById(refNode.parent_id);
        if (!parent) {
          this.treeNodes.push(createdItem);
          break;
        }
        if (!parent.children) {
          parent.children = [];
        }

        const index = parent.children.indexOf(refNode);
        if (positionType === SpecPositionType.Below) {
          parent.children.splice(index + 1, 0, createdItem);
        } else {
          parent.children.splice(index, 0, createdItem);
        }
        break;

      case SpecPositionType.Child:
        if (!refNode.children) {
          refNode.children = [];
        }
        refNode.lazy = false;
        refNode.has_children = true;
        refNode.children.push(createdItem);
        refNode.expandable = true;
        break;
    }
    this.nodesMap.set(createdItem.id, createdItem);
  }

  public async loadChildrens(id: number) {
    const resp = await API.getSpecChildItems(id.toString());
    if (resp.success) {
      const children = resp.result;
      if (!children) {
        return [];
      }
      children.forEach((child: SpecItem) => {
        this.reformatSpec(child);
        this.nodesMap.set(child.id, child);
      });

      return children;
    }
    return [];
  }

  public async deleteSpecItem(id: number) {
    const resp = await API.deleteSpecItems([id]);
    if (resp.success) {
      const deletedItem = this.findNodeById(id);
      if (!deletedItem) {
        return false;
      }
      this.nodesMap.delete(id);

      if (deletedItem.parent_id === 0) {
        const index = this.treeNodes.indexOf(deletedItem);
        this.treeNodes.splice(index, 1);
        return true;
      } else {
        const parent = this.findNodeById(deletedItem.parent_id);
        if (!parent || !parent.children) {
          return false;
        }
        const index = parent.children.indexOf(deletedItem);
        parent.children.splice(index, 1);
        if (parent.children.length === 0) {
          parent.has_children = false;
          parent.expandable = false;
        }
        return true;
      }
    }
    return false;
  }
}

export function allocateSpecItem(): SpecItem {
  return {
    id: 0,
    key: '',
    project_id: '',
    spec_id: 1,
    summary: '',
    description: '',
    priority: '',
    status: '',
    reporter_id: 'a621d1d7-30d9-4f19-89fc-efe5126ca8a4',
    type: '',
    sequence: 0,
    has_children: false,

    path: '',
    depth: 0,
    parent_id: 0,
    custom_fields: {},
    created_at: '',
    updated_at: '',
  };
}
