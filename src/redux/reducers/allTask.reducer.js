const initState = {
    data: null
}

const AllTask = (state = initState, action) => {
    switch (action.type) {
        case "SET_ALL_TASK":
            return { ...state, data: action.data };

        default:
            return state;
        }
    }
        
export default AllTask;