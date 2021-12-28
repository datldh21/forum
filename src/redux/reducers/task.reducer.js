const initState = {
    data: null
}

const Task = (state = initState, action) => {
    switch (action.type) {
        case "SET_TASK":
            return { ...state, data: action.data };

        case "UPDATE_TASK_STATUS":
            const data = action.data;
            const newState = state.data.map((item) => {
                if (item.id === data.id) {
                    item.statusId = data.status;
                    return item;
                }
                return item;
            });
            return {...state, data: newState};

        case "UPDATE_TASK": 
            const data1 = action.data;
            const newState1 = state.data.map((item) => {
                if (item.id === data1.taskId) {
                    item.assignee = data1.assignee;
                    item.deadline = data1.deadline;
                    item.description = data1.description;
                    item.point = data1.point;
                    item.priority = data1.priority;
                    item.project = data1.project;
                    item.sprint = data1.sprint;
                    item.status = data1.status;
                    item.title = data1.title;
                    return item;
                }
                return item;
            });
            return {...state, data: newState1};
        
        case "DELETE_TASK": 
            const newTask = state.data.filter((task) => task.id != action.data);
            return { ...state, data: newTask };

        default:
            return state;
        }
    }
        
export default Task;