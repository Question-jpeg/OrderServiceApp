import client from "./client";

const apiEndpoint = 'api/orders/'

const getOrders = () => client.get(apiEndpoint)
const get = (id) => client.get(`${apiEndpoint}${id}/`)

export default {
    getOrders,
    get
}