import request from './requests';

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
        depth: 1,
      },
    });
  },

  getSpecChildItems(parentId) {
    return request('/spec_items', 'get', {
      params: {
        parent_id: parentId,
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
        top: 25,
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

  getNextPageSpecItems(id) {
    return request('/spec_items', 'get', {
      params: {
        next: id,
      },
    });
  },

  getPrevPageSpecItems(id) {
    return request('/spec_items', 'get', {
      params: {
        prev: id,
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
  }
};

export default API;
