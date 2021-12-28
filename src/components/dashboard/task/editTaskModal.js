import "./editTaskModal.scss";
import axios from "axios";
import Url from "../../../util/url";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Modal, ModalBody, Button, Form, FormControl, ModalFooter } from "react-bootstrap";
import moment from "moment";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const EditTaskModal = (props) => {
    const taskId = props.taskId;
    const [taskData, setTaskData] = useState("");
    const [title, setTitle] = useState(undefined);
    const [description, setDescription] = useState(undefined);
    const [status, setStatus] = useState(undefined);
    const [assignee, setAssignee] = useState(undefined);
    const [deadline, setDeadline] = useState(undefined);
    const [priority, setPriority] = useState(undefined);
    const [point, setPoint] = useState(undefined);
    const [project, setProject] = useState(undefined);
    const [sprint, setSprint] = useState(undefined);
    const dispatch = useDispatch();
    const pageState = useSelector((state) => state.page);
    const userState = useSelector((state) => state.user);
    const statusState = useSelector((state) => state.status);
    const projectValue = useSelector((state) => state.credit.project);
    const sprintValue = useSelector((state) => state.sprint);

    const fetchTaskData = async () => {
        const res = await axios.get(Url("task/" + taskId));
        if (res.data.success) {
            const data = res.data?.response.map((item) => {
                return {
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    type: item.type,
                    assignee: item?.assignee[0]?._id,
                    assigneeName: item?.assignee[0]?.firstName + " " + item?.assignee[0]?.lastName,
                    assigneeAvatar: item?.assignee[0]?.avatar,
                    reporterName: item.reporter[0].firstName + " " + item.reporter[0].lastName,
                    reporterAvatar: item.reporter[0].avatar,
                    project: item.project,
                    priority: item.priority,
                    deadline: item.deadline,
                    sprint: item.sprint[0]._id,
                    sprintName: item.sprint[0].name,
                    point: item.point,
                    statusId: item.status[0]._id,
                    statusTitle: item.status[0].title.toUpperCase(),
                    parent: item.parent,
                    shortId: item.shortId,
                }
            });
            setTaskData(data);
            setTitle(data[0].title);
            setDescription(data[0].description);
            setStatus(data[0].statusId);
            setAssignee(data[0].assignee);
            setDeadline(data[0].deadline);
            setPriority(data[0].priority);
            setPoint(data[0].point);
            setProject(data[0].project);
            setSprint(data[0].sprint);
            return data;
        }
    };

    useEffect(() => {
        fetchTaskData();
    }, []);

    const handleTitle = async (e) => {
        const value = e.target.value;
        setTitle(value);
    }

    const handleDescription = async (e, editor) => {
        const data = editor.getData();
        setDescription(data);
    }

    const handleStatus = async (e) => {
        const value = e.target.value;
        setStatus(value);
    }

    const handleAssignee = async (e) => {
        const value = e.target.value;
        setAssignee(value);
    }

    const handlePriority = async (e) => {
        const value = e.target.value;
        setPriority(value);
    }

    const handlePoint = async (e) => {
        const value = e.target.value;
        setPoint(value);
    }

    const handleProject = async (e) => {
        const value = e.target.value;
        setProject(value);
    }

    const handleSprint = async (e) => {
        const value = e.target.value;
        setSprint(value);
    }

    const fetchActiveSprint = async () => {
        const res = await axios.get(Url("sprint"));
        var sprintId;
        if (res.data.success) {
            res.data?.response.map((item) => {
                if (item.activeSprint == true) {
                    sprintId = item._id;
                }
            });
        }
        fetchSprintTask(sprintId);
    }

    const fetchBackLog = async () => {
        const res = await axios.get(Url("sprint"));
        var sprintId;
        if (res.data.success) {
            res.data?.response.map((item) => {
                if (item.backLog == true) {
                    sprintId = item._id;
                }
            });
        }
        fetchSprintTask(sprintId);
    }

    const fetchSprintTask = async (sprintId) => {
        const res = await axios.get(Url("task/sprint/" + sprintId));
        if (res.data.success) {
            const data = res.data?.response.map((item) => {
                return {
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    type: item.type,
                    assignee: item.assignee,
                    reporter: item.reporter,
                    project: item.project,
                    priority: item.priority,
                    deadline: moment(item.deadline).format("MMM D"),
                    sprint: item.sprint,
                    point: item.point,
                    statusId: item.status[0]._id,
                    statusTitle: item.status[0].title,
                    statusColor: item.status[0]?.color,
                    parent: item.parent,
                    shortId: item.shortId,
                    assigneeAvatar: item.assigneeAvatar,
                }
            });
            dispatch({ type: "SET_TASK", data: data && data });
            return data;
        }
    }

    const editTask = async (e) => {
        const taskDataUpdate = {
            taskId: taskId,
            title: title,
            description: description,
            status: status,
            assignee: assignee,
            deadline: deadline,
            priority: priority,
            point: point,
            project: project,
            sprint: sprint
        }
        const res = await axios.patch(Url("task/" + taskId), taskDataUpdate);
        fetchTaskData();
        if ((pageState) && (pageState == "active-sprint")) {
            fetchActiveSprint();
        }
        if ((pageState) && (pageState == "back-log")) {
            fetchBackLog();
        }
        props?.onHide();
    }

    const deleteTask = async () => {
        const res = await axios.delete(Url("task/" + taskId));
        dispatch({ type: "DELETE_TASK", data: taskId });
        props?.onHide();
    }

    return (
        <>
            <Modal 
                {...props} 
                size="xl" 
                aria-labelledby="contained-modal-title-vcenter" 
                centered
            >

                <ModalBody>
                    {taskData && (
                        <div className="edit-task-modal">
                            <div className="left">
                                <div className="shortId">
                                    {taskData[0].shortId}
                                </div>
                                <div className="title">
                                    <h5>Title</h5>
                                    <FormControl 
                                        type="text"
                                        name="title"
                                        defaultValue={taskData[0].title}
                                        onChange={handleTitle}
                                    />
                                </div>
                                <div className="description">
                                    <h5>Description</h5>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={taskData[0].description}
                                        onChange={handleDescription}
                                    />
                                </div>
                            </div>
                            <div className="right">
                                <div className="status">
                                    <Form.Select onChange={handleStatus}>
                                        {statusState && statusState.length > 0 && (
                                            statusState.map((item, index) => {
                                                if (item._id == taskData[0].statusId) {
                                                    return (
                                                        <option key={index} selected="selected" value={item._id}>{item.title.toUpperCase()}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option key={index} value={item._id}>{item.title.toUpperCase()}</option>
                                                    )
                                                }
                                            })
                                        )}
                                    </Form.Select>
                                </div>
                                <div className="box">
                                    <div className="assignee">
                                        <h5>Assignee</h5>
                                        <Form.Select onChange={handleAssignee}>
                                            <option></option>
                                            {userState && (
                                                userState.map((item) => {
                                                    if (item._id == taskData[0].assignee) {
                                                        return (
                                                            <option selected="selected" value={item._id}>
                                                                {item.firstName + " " + item.lastName}
                                                            </option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={item._id}>
                                                                {item.firstName + " " + item.lastName}
                                                            </option>
                                                        )
                                                    }
                                                })
                                            )}
                                        </Form.Select>
                                    </div>
                                    <div className="reporter">
                                        <h5>Reporter</h5>
                                        <img className="reporter-avatar" src={taskData[0].reporterAvatar} />
                                        <div className="reporter-name">{taskData[0].reporterName}</div>
                                    </div>
                                    <div className="deadline">
                                        <h5>Due date</h5>
                                        <div className="date">{moment(taskData[0].deadline).format("MMM D")}</div>
                                    </div>
                                    <div className="priority">
                                        <h5>Priority</h5>
                                        <FormControl 
                                            type="text"
                                            name="title"
                                            defaultValue={taskData[0].priority}
                                            onChange={handlePriority}
                                        />
                                    </div>
                                    <div className="point">
                                        <h5>Story Points</h5>
                                        <FormControl 
                                            type="text"
                                            name="priority"
                                            defaultValue={taskData[0].point}
                                            onChange={handlePoint}
                                        />
                                    </div>
                                    <div className="project">
                                        <h5>Components</h5>
                                        <Form.Select onChange={handleProject}>
                                            {projectValue && (
                                                projectValue.map((item, index) => {
                                                    if (item == taskData[0].project) {
                                                        return (
                                                            <option key={index} selected="selected" value={item}>{item}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option key={index} value={item}>{item}</option>
                                                        )
                                                    }
                                                })
                                            )}
                                        </Form.Select>
                                    </div>
                                    <div className="sprint">
                                        <h5>Sprint</h5>
                                        <Form.Select onChange={handleSprint}>
                                            {sprintValue && (
                                                sprintValue.map((item, index) => {
                                                    if (item._id == taskData[0].sprint) {
                                                        return (
                                                            <option key={index} selected="selected" value={item._id}>{item.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option key={index} value={item._id}>{item.name}</option>
                                                        )
                                                    }
                                                })
                                            )}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={editTask}>
                        Update
                    </Button>
                    <Button onClick={deleteTask}>
                        Delete
                    </Button>
                    <Button
                        className="close"
                        aria-label="Close"
                        onClick={() => {
                            props.onHide();
                        }}
                    >
                        {" "}
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default EditTaskModal;