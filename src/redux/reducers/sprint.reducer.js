const initState = [];

const Sprint = (state = initState, action) => {
    switch (action.type) {
        case "SET_SPRINT":
            return action.data;
        default:
            return state;
    }
};

export default Sprint;