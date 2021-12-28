import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import "./style.scss";

const ModalMoreUsers = (props) => {

    const sprintId = props?.sprintId;
    const userState = useSelector((state) => state.user);
    const users = userState && userState.length > 3 && userState.slice(3, userState.length);
    const sprintTaskState = useSelector((state) => state.sprintTask?.data);
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();

    const fetchUserTask = async (sprintId, userId) => {
        const data = sprintTaskState && sprintTaskState.length > 0 && sprintTaskState.filter((task) => task?.assignee[0]?._id == userId && task?.sprint[0]?._id == sprintId);
        dispatch({ type: "SET_TASK", data: data });
        setSelectedUser(userId);
    }
    
    return (
        <div className="modal-more-users">
            {users.map((item, index) => {
                return (
                    <div className="user" key={index} onClick={() => fetchUserTask(sprintId, item._id)}>
                        <div className="user-avatar">
                            {selectedUser == item._id ? (
                                <img className="active-user-avatar" src={item.avatar} />
                            ) : (
                                <img className="unactive-user-avatar" src={item.avatar} />
                            )}
                        </div>

                        <div className="user-name">
                            <p>{item.firstName} {item.lastName}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ModalMoreUsers;