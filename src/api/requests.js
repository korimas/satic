import axios from 'axios';
import { Dialog } from 'quasar';

let RequestInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

function successHandler(response) {
  return response.data;
}

function errorHandler(error) {
  Dialog.create({
    title: '错误',
    message: error.toString(),
  });
  return error;
}

function addParamsToUrl(url, params) {
  const urlParams = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      return acc;
    }, {})
  );
  const splitor = url.indexOf('?') === -1 ? '?' : '&';
  return url + splitor + urlParams.toString();
}

function request(url, method, { params = null, data = {}, headers = {} } = {}) {
  if (typeof params === 'object' && params !== null) {
    url = addParamsToUrl(url, params);
  }

  return RequestInstance({
    url,
    method,
    headers,
    data: data,
  }).then(successHandler, errorHandler);
}

// config header
// RequestInstance.interceptors.request.use(config => {
//     if (localStorage.token) {
//         config.headers.common['token'] = localStorage.token
//     }
//     return config
// });

// deal response
RequestInstance.interceptors.response.use((response) => {
  if (response.data.success === false) {
    Dialog.create({
      title: '错误',
      message: response.data.error.message,
    });
  }
  return response;
});

export default request;
