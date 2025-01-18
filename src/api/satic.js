import request from './requests';
import { Filter } from './filter';

let API = {
  // Projects
  getAllPrjects() {
    return request('/projects', 'get');
  },

  getProject(id) {
    return request(`/projects`, 'get', {
      params: {
        id: id,
      },
    });
  },

  createProject(data) {
    return request('/projects', 'post', {
      data: data,
    });
  },

  deleteProjects(ids) {
    return request('projects', 'delete', {
      data: {
        ids: ids,
      },
    });
  },

  // Issues
  createIssue(data) {
    return request('/issues', 'post', {
      data: data,
    });
  },

  getAllIssues() {
    return request('/issues', 'get');
  },

  // specs
  createSpecItem(data) {
    return request('/spec_items', 'post', {
      data: data,
    });
  },

  getSpecRootItems() {
    return request('/spec_items', 'get', {
      params: {
        query: [new Filter().condition('depth', '=', 1).sort('sequence', 'ASC').build()],
      },
    });
  },

  getSpecChildItems(parentId) {
    return request('/spec_items', 'get', {
      params: {
        query: [new Filter().condition('parent_id', '=', parentId).sort('sequence', 'ASC').build()],
      },
    });
  },

  deleteSpecItems(ids) {
    return request('/spec_items', 'delete', {
      data: {
        ids: ids,
      },
    });
  },

  getTopSpecItems() {
    return request('/spec_items', 'get', {
      params: {
        query: [new Filter().sort('sequence', 'ASC').limit(25).build()],
      },
    });
  },

  getSpecItemsNearBy(id) {
    return request('/spec_items', 'get', {
      params: {
        near_id: id,
      },
    });
  },

  getNextPageSpecItems(sequence) {
    return request('/spec_items', 'get', {
      params: {
        query: [new Filter().condition('sequence', '>', sequence).sort('sequence', 'ASC').limit(25).build()],
      },
    });
  },

  getPrevPageSpecItems(sequence) {
    return request('/spec_items', 'get', {
      params: {
        query: [new Filter().condition('sequence', '<', sequence).sort('sequence', 'DESC').limit(25).build()],
      },
    });
  },

  updateSpecItem(id, data) {
    data.id = id;
    return request(`/spec_items`, 'put', {
      data: data,
    });
  },
  createSpecComment(data) {
    return request('/spec_comments', 'post', {
      data: data,
    });
  },
  getSpecComments(specItemId) {
    return request('/spec_comments', 'get', {
      params: {
        spec_item_id: specItemId,
      },
    });
  },
  deleteSpecComments(ids) {
    return request('/spec_comments', 'delete', {
      data: {
        ids: ids,
      },
    });
  },
  updateSpecComment(id, data) {
    data.id = id;
    return request(`/spec_comments`, 'put', {
      data: data,
    });
  }
};

export default API;
