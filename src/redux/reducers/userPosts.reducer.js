const initState = [];

const UserPosts = (state = initState, action) => {
    switch (action.type) {
        case 'SET_USER_POSTS':
            return action.data;
        default:
            return state;
    }
};

export default UserPosts;
