import instance from './baseConfig';

export const get = (url) => instance.get(url);

export const post = (url, data) => instance.post(url, data);

export const put = (url, data) => instance.put(url, data);

export const del = (url) => instance.delete(url);

export const patch = (url, data) => instance.patch(url, data);

export const getID = (url, id) => instance.get(`${url}/${id}`);
export default {
  get,
  post,
  put,
  del,
  patch,
  getID,
};
