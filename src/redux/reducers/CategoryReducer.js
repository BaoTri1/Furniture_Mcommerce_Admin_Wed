import { GET_PARENT_CATEGORY } from "../type";

const CategoryInitialState = {
    category: [],
    typeroom:[],
    parentcategory: [],
}

const CategoryReducer = (state = CategoryInitialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case GET_PARENT_CATEGORY :
            return {
                ...state,
                parentcategory: payload
            }
        default:
            return state;
    }
}

export default CategoryReducer