import client from "./client";

const apiEndpoint = 'auth/jwt/'

const login = (userInfo) => client.post(`${apiEndpoint}create/`, userInfo)
const refresh = (refreshToken) => client.post(`${apiEndpoint}refresh/`, {'refresh': refreshToken})

export default {
    login,
    refresh
}