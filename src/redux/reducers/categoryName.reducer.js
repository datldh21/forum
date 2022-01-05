const initState = '';
const CategoryName = (state = initState, action) => {
    switch (action.type) {
        case 'SET_CATEGORY_NAME':
            return action.data;
        default:
            return state;
    }
};

export default CategoryName;
