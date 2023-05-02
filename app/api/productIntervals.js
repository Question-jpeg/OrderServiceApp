
import client from './client';

const apiEndpoint = (productId) => `api/products/${productId}/intervals/`

const put = (productId, intervalId, data) => client.put(`${apiEndpoint(productId)}${intervalId}/`, data)
const post = (productId, data) => client.post(apiEndpoint(productId), data)
const del = (productId, formData) => client.post(`${apiEndpoint(productId)}deleteIds/`, formData)

export default {
    put,
    post,
    del
}