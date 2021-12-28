const initState = [];
const MyItem = (state = initState, action) => {
    switch (action.type) {
        case 'SET_MY_ITEM':
            return action.data;

        case 'UPDATE_MY_ITEM':
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

export default MyItem;
