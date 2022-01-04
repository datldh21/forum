const initState = [];

const Categories = (state = initState, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.data;
        default:
            return state;
    }
};

export default Categories;
