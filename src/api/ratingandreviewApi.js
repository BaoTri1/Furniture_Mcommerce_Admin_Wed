import axios from "axios";

const ratingandreviewApi = {
    getRatingProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `reviews/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getListReviewForProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `reviews/product/?${params}`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default ratingandreviewApi;