import client from "./client";

const apiEndpoint = (order_id) => `api/orders/${order_id}/items/`

const put = (order_id, id, data) => client.put(`${apiEndpoint(order_id)}${id}/`, data)
const post = (order_id, data) => client.post(apiEndpoint(order_id), data)
const del = (order_id, formData) => client.post(`${apiEndpoint(order_id)}deleteIds/`, formData)

export default {
    put,
    post,
    del
}