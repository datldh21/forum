const initState = {
    userInfo: null,
};
const MyProfile = (state = initState, action) => {
    switch (action.type) {
        case "SET_USER_INFO":
            return { ...state.userInfo, userInfo: action.data };
        case "UPDATE_POINT":
            return { ...state, userInfo: { ...state.userInfo, point: action.data } };
        case "UPDATE_CREDIT_USER":
            return { ...state, userInfo: { ...state.userInfo, credit: action.data } };
        case "UPDATE_NAME":
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    firstName: action.data.firstName,
                    lastName: action.data.lastName,
                },
            };
        case "UPDATE_AVATAR":
            return { ...state, userInfo: { ...state.userInfo, avatar: action.data.avatar } };
        default:
            return state;
    }
};

export default MyProfile;
