const initState = [];

const NextSprintTask = (state = initState, action) => {
    switch (action.type) {
        case "SET_NEXT_SPRINT_TASK":
            let dataUpdate;
            let check = true;
            if (action.data != null) {
                if (state && state.length != 0) {
                    state[0].map((item) => {
                        if (item.id == action.data[0].id) {
                            check = false;
                        }
                    });
                    if (check == true) {
                        dataUpdate = [state[0].concat(action.data)];
                    } else {
                        dataUpdate = state;
                    }
                } else {
                    dataUpdate = [action.data];
                }
                return dataUpdate;
            }

        default:
            return state;
        }
    }
        
export default NextSprintTask;