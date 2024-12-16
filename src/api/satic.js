import { getProject } from 'src/data/demo';
import request from './requests';

let API = {
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

  createIssue(data) {
    return request('/issues', 'post', {
      data: data,
    });
  },
};

export default API;
