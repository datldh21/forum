const initState = {

};

const Credit = (state = initState, action) => {
    switch (action.type) {
        case "SET_CREDIT":
            return {
                ...state,
                poolCredit: action.data.poolCredit,
                surplusPoolCredit: action.data.surplusPoolCredit,
                project: action.data.project
            };
        case "UPDATE_SURPLUS_POOL_CREDIT":
            return {
                ...state,
                surplusPoolCredit: action.data
            }
        default:
            return state;
    }
};

export default Credit;
