const initState = [];

const Posts = (state = initState, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return action.data;
        default:
            return state;
    }
};

export default Posts;
