import { GET_PARENT_CATEGORY, PATH_GET_PARENT_CATEGORY } from "../type";
import axios from 'axios'


export const getParentCategory = () => async (dispatch) => {
    await axios.get(PATH_GET_PARENT_CATEGORY)
        .then(res => {
            const parentCategory = res.data.results.data.map(item => ({
                id: item.idcatParent,
                name: item.name
            }));
            console.log(parentCategory)
            dispatch({type: GET_PARENT_CATEGORY, payload: parentCategory});
        })
        .catch((err) => console.log('Get ParentCategory api error: ', err));
};


