const initState = {

};
const Status = (state = initState, action) => {
    switch (action.type) {
        case "SET_STATUS":
            return action.data;
        default:
            return state;
    };
};

export default Status;