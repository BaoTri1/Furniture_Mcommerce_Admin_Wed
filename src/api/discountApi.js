import axios from "axios";

const discountApi = {
    createDiscount: (params) => {
        const url = process.env.REACT_APP_API_URL + 'discounts/addDiscount';
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getListDiscountByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `discounts/?${paramString}`;
        return axios.get(url);
    },

    updateDiscount: (id, params) => {
        const url = process.env.REACT_APP_API_URL + `discounts/update/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    deleteDiscount: (id) => {
        const url = process.env.REACT_APP_API_URL + `discounts/${id}`;
        return axios.delete(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default discountApi;