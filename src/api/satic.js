import { getProject } from 'src/data/demo';
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
};

export default API;
