const initState = '';
const CategoryNow = (state = initState, action) => {
    switch (action.type) {
        case 'SET_CATEGORY_NOW':
            return action.data;
        default:
            return state;
    }
};

export default CategoryNow;
