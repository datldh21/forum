const initState = [];
const User = (state = initState, action) => {
    switch (action.type) {
        case 'SET_USER':
            // return { userId: action.id };
            return action.data;
        case 'SET_BONUS_BY_USER':
            return action.data;
        case 'UPDATE_BONUS_BY_USER':
            let dataUpdate;
            if (state && state.length != 0) {
                dataUpdate = [action.data, ...state];
            } else {
                dataUpdate = [action.data];
            }
            return dataUpdate;
        default:
            return state;
    }
};

export default User;
