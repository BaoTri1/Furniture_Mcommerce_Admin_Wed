import axios from "axios";

const serviceApi = {
    getInformation: () => {
        const url = process.env.REACT_APP_API_URL + `services/information`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
    getStatisticalMostProductForMonth: (params) => {
        const url = process.env.REACT_APP_API_URL + `services/most-product-for-month/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getStatisticalProduct_ParentCategory: () => {
        const url = process.env.REACT_APP_API_URL + `services/StatisticalProductByParentCategory`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getStatisticalForMonth: (params) => {
        const url = process.env.REACT_APP_API_URL + `services/StatisticalForMonth/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getMonthlyRevenueStatisticsByCategory: (params) => {
        const url = process.env.REACT_APP_API_URL + `services/MonthlyRevenueStatisticsByCategory/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getOrderByListStatus: (params) => {
        const url = process.env.REACT_APP_API_URL + `services/order-by-status/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default serviceApi;