import client from "./client";

const apiEndpoint = (productId) => `api/products/${productId}/files/`;

const put = (productId, fileId, data) =>
  client.put(`${apiEndpoint(productId)}${fileId}/`, data);
const post = (productId, data) => client.post(apiEndpoint(productId), data);
const del = (productId, formData) =>
  client.post(`${apiEndpoint(productId)}deleteIds/`, formData);
const makePrimary = (productId, fileId) =>
  client.post(`${apiEndpoint(productId)}makePrimary/`, { id: fileId });

export default {
  put,
  post,
  del,
  makePrimary
};
