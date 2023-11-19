import axios from "axios";

const userApi = {
    login: (params) => {
        const url = process.env.REACT_APP_API_URL + 'users/login';
        return axios.post(url, params);
    },

    getListUserByPage: (params) => {
        const url = process.env.REACT_APP_API_URL + `users/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getInfo: () => {
        const url = process.env.REACT_APP_API_URL + `users/info`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    }
}

export default userApi;