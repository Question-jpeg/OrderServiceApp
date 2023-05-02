import client from "./client";

const apiEndpoint = 'api/push-tokens/'

const setToken = (push_token) => client.post(apiEndpoint, {push_token})
const deleteToken = () => client.delete(`${apiEndpoint}delete_token/`)
const isToken = () => client.get(`${apiEndpoint}is_token/`)

export default {
    setToken,
    deleteToken,
    isToken
}