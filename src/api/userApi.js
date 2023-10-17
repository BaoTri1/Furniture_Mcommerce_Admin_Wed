import axios from "axios";

const userApi = {
    login: (params) => {
        const url = process.env.REACT_APP_API_URL + 'users/login';
        return axios.post(url, params);
    }
}

export default userApi;