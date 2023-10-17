import axios from "axios";

const productApi = {
    getListCategory: () => {
        const url = process.env.REACT_APP_API_URL + 'categories/all';
        return axios.get(url);
    },

    getListtyperoom: () => {
        const url = process.env.REACT_APP_API_URL + 'categories/KindOfRoom/all';
        return axios.get(url);
    },

    getListcatParent: () => {
        const url = process.env.REACT_APP_API_URL + 'categories/parentCategory/all';
        return axios.get(url);
    },

    addCategory: (params) => {
        const url = process.env.REACT_APP_API_URL + 'categories/addCategory';
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    addTypeRoom: (params) => {
        const url = process.env.REACT_APP_API_URL + `categories/addKindOfRoom`;
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    addParentCategory: (params) => {
        const url = process.env.REACT_APP_API_URL + `categories/addparentCategory`;
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    deleteCategory: (id) => {
        console.log(id);
        const url = process.env.REACT_APP_API_URL + `categories/${id}`;
        return axios.delete(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateCategory: (id, params) => {
        console.log(id);
        console.log(params);
        const url = process.env.REACT_APP_API_URL + `categories/updateCategory/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateTypeRoom: (id, params) => {
        console.log(id);
        console.log(params);
        const url = process.env.REACT_APP_API_URL + `categories/updateKindOfRoom/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateParentCategory: (id, params) => {
        console.log(id);
        console.log(params);
        const url = process.env.REACT_APP_API_URL + `categories/updateParentCategory/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    deletetyperoom: (id) => {
        console.log(id);
        const url = process.env.REACT_APP_API_URL + `categories/KindOfRoom/${id}`;
        return axios.delete(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    deleteCatParent: (id) => {
        console.log(id);
        const url = process.env.REACT_APP_API_URL + `categories/ParentCategory/${id}`;
        return axios.delete(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default productApi;