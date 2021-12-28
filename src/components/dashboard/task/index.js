import "./style.scss";
import { useState } from "react";
import EditTaskModal from "./editTaskModal";
import { useDrag } from "react-dnd";
import taskIcon from "../../../assets/images/task.svg";
import subTaskIcon from "../../../assets/images/SubTask.svg";
import bugIcon from "../../../assets/images/BugIcon.svg";
import TaskButton from "../../../assets/images/TaskButton.svg";
import ChildTask from "./childTask";
import { useSelector } from "react-redux";

const Task = (props) => {
    const task = props?.task;
    const id = task?.id;
    const title = task?.title;
    const deadline = task?.deadline;
    const project = task?.project;
    const type = task?.type;
    const priority = task?.priority;
    const point = task?.point;
    const assigneeAvatar = task?.assignee[0]?.avatar;
    const shortId = task?.shortId;
    const statusTitle = task?.statusTitle;
    const statusColor = task?.statusColor;

    let countChildTask = 0;
    let countDoneChildTask = 0;
    let progressiveTask;
    let avatarChildTask = [];
    const taskState = useSelector((state) => state.task?.data);
    const pageState = useSelector((state) => state.page);
    
    if (taskState && taskState.length > 0) {
        taskState.map((item) => {
            if (item.parent == id) {
                countChildTask++;
                if (item.assignee[0]?.avatar != assigneeAvatar) {
                    avatarChildTask.push(item.assignee[0]?.avatar);
                }
                if (item.statusTitle == "done") {
                    countDoneChildTask++;
                }
            }
        });
        progressiveTask = countDoneChildTask / countChildTask;
    }

    const [editTaskModalShow, setEditTaskModalShow] = useState(false);
    const [childTaskShow, setChildTaskShow] = useState(false);

    const handleClick = () => {
        setEditTaskModalShow(true);
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "TASK",
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <>
            <div 
            className="wrap-task"
            ref={drag}
            style={{ opacity: isDragging ? 0 : 1 }}
            >
                <div className="task-box" onClick={() => handleClick()}>
                    <div className="task-content">
                        <div className="line">
                            <div className="line-1">
                                <div className="left">
                                    {type == "Task" && (
                                        <div className="type">
                                            <img className="task-icon" src={taskIcon} />
                                        </div>
                                    )}
                                    {type == "Sub Task" && (
                                        <div className="type">
                                            <img className="subtask-icon" src={subTaskIcon} />
                                        </div>
                                    )}
                                    {type == "Bug" && (
                                        <div className="type">
                                            <img className="bug-icon" src={bugIcon} />
                                        </div>
                                    )}
                                    <div className="deadline">
                                        {deadline}
                                    </div>
                                    {priority == "" && type == "Task" && (
                                        <div className="priority">-</div>
                                    )}
                                    {priority != "" && type == "Task" && (
                                        <div className="priority">
                                            {priority}
                                        </div>
                                    )}
                                    {priority != "" && type == "Bug" || type == "Sub Task" && (
                                        <div className="priority"></div>
                                    )}
                                </div>
                                {type == "Task" && (
                                    <div className="wrap-project">
                                        <div className="project">
                                            {project}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="line-2">
                                <div className="title">
                                    {title}
                                </div>
                                <div className="right">
                                    <div className="assignee">
                                        <img src={assigneeAvatar} />
                                        {avatarChildTask.length > 0 && (
                                            avatarChildTask.map((item, index) => {
                                                return (
                                                    <img
                                                        className="child-task-avatar" 
                                                        src={item}
                                                        style={{transform: `translateX(${-(index+1)*10}px)`}}
                                                    />
                                                )
                                            })
                                        )}
                                    </div>
                                    {type != "Task" && (
                                        <div className="wrap-status-name" style={{backgroundColor: `${statusColor}`}}>
                                            <p>{statusTitle.toUpperCase()}</p>
                                        </div>
                                    )}
                                    <div className="shortId">
                                        {shortId}
                                    </div>
                                    <div className="wrap-point">
                                        {point != null ? (
                                            <div className="point">
                                                {point}
                                            </div>
                                        ) : (
                                            <div className="point">-</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {pageState && pageState == "active-sprint" && type == "Task" && (
                                <div className="line-3">
                                    <div className="progressive-task">
                                        <div className="progress-now" style={{width: `${progressiveTask * 100}%`}}></div>  
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {editTaskModalShow && (
                    <EditTaskModal
                        show={true}
                        onHide={() => setEditTaskModalShow(false)}
                        taskId={id}
                    />
                )}
            
                {type == "Task" && childTaskShow == false && (
                    <div 
                        className="task-btn"
                        onClick={() => {setChildTaskShow(true)}}
                        style={{cursor: "pointer"}}
                    >
                        <img src={TaskButton} />
                    </div>
                )}
                {childTaskShow && (
                    <ChildTask 
                        show={true}
                        onHide={() => setChildTaskShow(false)}
                        parentId={id}
                    />
                )}
            </div>
        </>
    )
}

export default Task;