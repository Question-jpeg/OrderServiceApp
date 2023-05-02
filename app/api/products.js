
import client from './client';

const apiEndpoint = 'api/products/'

const getProducts = () => client.get(apiEndpoint)

const get = (id) => client.get(`${apiEndpoint}${id}/`)
const getPrice = (id, data) => client.post(`${apiEndpoint}${id}/getPrice/`, data)
const put = (id, productData) => client.put(`${apiEndpoint}${id}/`, productData)
const post = (productData) => client.post(apiEndpoint, productData)

export default {
    getProducts,
    get,
    getPrice,
    put,
    post,
}