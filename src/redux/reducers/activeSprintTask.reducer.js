const initState = {
    data: null
}

const SprintTask = (state = initState, action) => {
    switch (action.type) {
        case "SET_SPRINT_TASK":
            return { ...state, data: action.data };
        
        default:
            return state;
        }
    }
        
export default SprintTask;