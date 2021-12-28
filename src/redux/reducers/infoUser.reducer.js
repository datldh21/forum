const initState = [];
const UserInfo = (state = initState, action) => {
    switch (action.type) {
        case 'GET_ALL_USER':
            return action.data;
        case 'UPDATE_POINT_USER':
            const data = action.data;
            const newsate = state.map((item) => {
                if (item._id === data.userId) {
                    item.point = data.point;
                    return item;
                }
                return item;
            });
            return newsate;
        default:
            return state;
    }
};

export default UserInfo;
