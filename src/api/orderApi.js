import axios from "axios";

const orderApi = {
    getListOrderByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `orders/?${paramString}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getInforOrder: (id) => {
        const url = process.env.REACT_APP_API_URL + `orders/items/?${id}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getListStatus: () => {
        const url = process.env.REACT_APP_API_URL + `orders/list-status`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateOrder: (id, params) => {
        console.log(id);
        console.log(params);
        const url = process.env.REACT_APP_API_URL + `orders/update/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default orderApi;