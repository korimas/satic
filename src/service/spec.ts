import API from 'src/api/satic';
import { SpecItem } from 'src/data/structs';
import { SpecPositionType } from 'src/data/constances';

export class SpecTree {
  public treeNodes: SpecItem[];
  public treeNodesMap: Map<number, SpecItem>;
  public contentNodes: SpecItem[];
  public contentNodesMap: Map<number, SpecItem>;
  public selectedNodeId: number;
  public jumpToContentNodeId: number;
  public jumpToTreeNodeItem: SpecItem | null;
  public inited: boolean;
  public topNodeId: number;
  public bottomNodeId: number;

  constructor() {
    this.treeNodes = [];
    this.treeNodesMap = new Map<number, SpecItem>();
    this.contentNodes = [];
    this.contentNodesMap = new Map<number, SpecItem>();
    this.selectedNodeId = -1;
    this.jumpToContentNodeId = -1
    this.jumpToTreeNodeItem = null;
    this.topNodeId = -1;
    this.bottomNodeId = -1;
    this.inited = false;
  }

  public reformatSpec(spec: SpecItem) {
    spec.lazy = spec.has_children;
    spec.key = spec.id.toString();
  }

  public async init() {
    await this.loadRootSpecs();
    await this.loadTopContentSpecs();
    this.inited = true;
  }

  public async loadTopContentSpecs() {
    console.log('loadTopContentSpecs');
    const resp = await API.getTopSpecItems();
    if (resp.success) {
      this.contentNodesMap.clear();
      const specs = resp.result;
      this.contentNodes = specs;
      specs.forEach((spec: SpecItem) => {
        this.contentNodesMap.set(spec.id, spec);
      });
      this.topNodeId = this.contentNodes[0].id;
    }
    return resp.success;
  }

  public async loadContentSpecsNear(id: number) {
    console.log('loadContentSpecs', id);
    if (this.contentNodesMap.has(id)) {
      return true;
    }

    const resp = await API.getSpecItemsNearBy(id);
    if (resp.success) {
      this.contentNodesMap.clear();
      const specs = resp.result;
      this.contentNodes = specs;
      specs.forEach((spec: SpecItem) => {
        this.contentNodesMap.set(spec.id, spec);
      });
    }
    return resp.success;
  }

  public async loadPrevPageContentSpecs() {
    const firstNode = this.contentNodes[0];
    if (!firstNode) {
      throw new Error('No first node found');
    }

    if (firstNode.id === this.topNodeId) {
      return false;
    }

    console.log('loadPrevPageContentSpecs', firstNode.sequence);
    const resp = await API.getPrevPageSpecItems(firstNode.sequence);
    if (resp.success) {
      const specs = resp.result;
      console.log('loadPrevPageContentSpecs', specs);
      specs.forEach((spec: SpecItem) => {
        this.contentNodesMap.set(spec.id, spec);
        this.contentNodes.unshift(spec);
      });

      if (specs.length < 25) {
        // eatch page has 25 items
        this.topNodeId = this.contentNodes[0].id;
        return false;
      }
    }
    return resp.success;
  }

  public async loadNextPageContentSpecs() {
    const lastNode = this.contentNodes[this.contentNodes.length - 1];
    if (!lastNode) {
      throw new Error('No last node found');
    }

    if (lastNode.id === this.bottomNodeId) {
      return false;
    }

    console.log('loadNextPageContentSpecs', lastNode.sequence);
    const resp = await API.getNextPageSpecItems(lastNode.sequence);
    if (resp.success) {
      const specs = resp.result;
      console.log('loadNextPageContentSpecs', specs);
      specs.forEach((spec: SpecItem) => {
        this.contentNodesMap.set(spec.id, spec);
        this.contentNodes.push(spec);
      });

      if (specs.length < 25) {
        // eatch page has 25 items
        this.bottomNodeId = specs[specs.length - 1].id;
        return false;
      }
    }
    return resp.success;
  }

  public async loadRootSpecs() {
    console.log('loadRootSpecs');
    const resp = await API.getSpecRootItems();
    if (resp.success) {
      const specs = resp.result;
      this.treeNodesMap.clear();
      this.treeNodes = [];
      specs.forEach((spec: SpecItem) => {
        this.reformatSpec(spec);
        this.treeNodesMap.set(spec.id, spec);
        this.treeNodes.push(spec);
      });
    }
  }

  public findNodeById(id: number) {
    return this.treeNodesMap.get(id);
  }

  public findNodeByKey(key: string) {
    return this.treeNodesMap.get(parseInt(key));
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
        this.treeNodesMap.set(child.id, child);
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
      // TODO: update contentNodes
      // await this.loadContentSpecsNear(created.id);
      this.selectedNodeId = created.id;
      this.jumpToContentNodeId = created.id;

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
        if (refNode.parent_id === 0 || !refNode.parent_id) {
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
    this.treeNodesMap.set(createdItem.id, createdItem);
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
        this.treeNodesMap.set(child.id, child);
      });

      return children;
    }
    return [];
  }

  public async deleteSpecItems(ids: number[] | string[]) {
    const resp = await API.deleteSpecItems(ids);
    if (resp.success) {
      const deletedIDs = resp.result as number[]; // TODO: 显示未成功删除的消息
      deletedIDs.forEach((id) => {
        this.updateTreeAfterDelete(id);
        const content = this.contentNodesMap.get(id);
        if (content) {
          this.contentNodesMap.delete(id);
          const index = this.contentNodes.indexOf(content);
          this.contentNodes.splice(index, 1);
          // TODO: 更新其他属性
        }
      });
      return true;
    }
    return false;
  }

  public updateTreeAfterDelete(id: number | string) {
    const intID = parseInt(id.toString());
    const deletedItem = this.findNodeById(intID);
    if (!deletedItem) {
      return false;
    }
    this.treeNodesMap.delete(intID);

    if (!deletedItem.parent_id || deletedItem.parent_id <= 0) {
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
