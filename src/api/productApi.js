import axios from "axios";

const productApi = {
    getListCategoryByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `categories/?${paramString}`;
        return axios.get(url);
    },

    getListCategory: () => {
        const url = process.env.REACT_APP_API_URL + `categories/all`;
        return axios.get(url);
    },

    getListTyperoomByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `categories/KindOfRoom/?${paramString}`;
        return axios.get(url);
    },

    getListTyperoom: () => {
        const url = process.env.REACT_APP_API_URL + `categories/KindOfRoom/all`;
        return axios.get(url);
    },

    getListcatParentByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `categories/parentCategory/?${paramString}`;
        console.log(url)
        return axios.get(url);
    },

    getListcatParent: () => {
        const url = process.env.REACT_APP_API_URL + `categories/parentCategory/all`;
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

    //API call products
    createProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `products/addProduct`;
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getListProductByPage: (paramString) => {
        const url = process.env.REACT_APP_API_URL + `products/?${paramString}`;
        return axios.get(url);
    },

    getListProduct: () => {
        const url = process.env.REACT_APP_API_URL + `products/all`;
        return axios.get(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    getInfoProduct: (id) => {
        const url = process.env.REACT_APP_API_URL + `products/items/?${id}`;
        return axios.get(url);
    },

    deleteproduct: (id) => {
        console.log(id);
        const url = process.env.REACT_APP_API_URL + `products/${id}`;
        return axios.delete(url, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateProduct: (id, params) => {
        console.log(id);
        console.log(params);
        const url = process.env.REACT_APP_API_URL + `products/update/${id}`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    uploadAvatarProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `images/uploadavatarproduct`;
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateAvatarProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `images/updateavatarproduct`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    uploadDetailImageProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `images/uploaddetailproduct`;
        return axios.post(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },

    updateDetailImageProduct: (params) => {
        const url = process.env.REACT_APP_API_URL + `images/updatedetailimagesproduct`;
        return axios.put(url, params, {
            headers: {
                Authorization: sessionStorage.getItem('accessToken'),
        }});
    },
}

export default productApi;