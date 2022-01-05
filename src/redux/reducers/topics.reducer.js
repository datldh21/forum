const initState = [];

const Topics = (state = initState, action) => {
    switch (action.type) {
        case 'SET_TOPICS':
            return action.data;
        default:
            return state;
    }
};

export default Topics;
