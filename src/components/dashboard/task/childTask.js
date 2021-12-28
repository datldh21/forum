import { useSelector } from "react-redux";
import { Fragment } from "react";
import CloseTaskButton from "../../../assets/images/CloseTaskButton.svg";
import TaskCantDrag from "./index";

const ChildTask = (props) => {
    const taskState = useSelector((state) => state.task?.data);
    const parentId = props?.parentId;

    return (
        <div className="child-task" {...props}>
            {taskState && taskState.map((item) => {
                if (item.parent == parentId) {
                    return (
                        <Fragment key={item.id}>
                            <TaskCantDrag task={item}/>
                        </Fragment>
                    )
                }
            })}
            <div className="task-btn" onClick={() => {props.onHide()}} style={{cursor: "pointer"}}>
                <img src={CloseTaskButton} />
            </div>
        </div>
    )
}

export default ChildTask;