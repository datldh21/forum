const initState = [];

const Users = (state = initState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return action.data;
        default:
            return state;
    }
};

export default Users;
