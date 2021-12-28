const initState = {

};
const Feedback = (state = initState, action) => {
    switch (action.type) {
        case "SET_USER_FEEDBACK":
            return action.data;
        default: 
            return state;
    };
};

export default Feedback;