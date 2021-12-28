const initState = {
    data: null,
    newNotification: false,
};
const Notifications = (state = initState, action) => {
    switch (action.type) {
        case "SET_DATA_NOTIFICATION":
            return { ...state, data: action.data };
        case "UPDATE_POINT_HISTORY_BONUS":
            const data = action.data;
            const newsate = state.data.map((item) => {
                if (item.id === data.id) {
                    item.point = data.point;
                    item.reason = data.reason;
                    return item;
                }
                return item;
            });

            return { ...state, data: newsate };
        case "DELETE_BONUS":
            const newBonus = state.filter((bonus) => bonus.id != action.data);
            return newBonus;
        case "SET_NOTIFICATION":
            return { ...state, newNotification: action.newNotification };
        default:
            return state;
    }
};

export default Notifications;
