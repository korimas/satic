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
  }
};

export default API;
