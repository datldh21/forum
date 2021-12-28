import "./createTaskModal.scss";
import axios from "axios";
import Url from "../../../util/url";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Modal, ModalBody, Button, Form, FormControl, ModalFooter } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";
import IsLoading from "../../IsLoading";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const CreateTaskModal = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shortId, setShortId] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState(null);
    const [status, setStatus] = useState(null);
    const [assignee, setAssignee] = useState(null);
    const [assigneeAvatar, setAssigneeAvatar] = useState(null);
    const [reporter, setReporter] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [priority, setPriority] = useState("");
    const [point, setPoint] = useState("");
    const [parent, setParent] = useState(null);
    const [project, setProject] = useState("");
    const [sprint, setSprint] = useState("");
    const dispatch = useDispatch();
    const pageState = useSelector((state) => state.page);
    const userState = useSelector((state) => state.user);
    const projectValue = useSelector((state) => state.credit.project);
    const allTaskState = useSelector((state) => state.allTask?.data);
    const sprintValue = useSelector((state) => state.sprint);

    const typeValue = ["Task", "Bug", "Sub Task"];

    const handleCreateShortId = async () => {
        const res = await axios.get(Url("task/quantity"));
        if (res.data.success) {
            const value = res.data?.response;
            setShortId("ABC - " + String(value + 1));
        }
    }
    handleCreateShortId();

    const handleCreateStatus = async () => {
        const res = await axios.get(Url("status"));
        if (res.data.success) {
            const value = res.data?.response[0]._id;
            setStatus(value);
        }
    }
    handleCreateStatus();

    const handleCreateTitle = async (e) => {
        const value = e.target.value;
        setTitle(value);
    }

    const handleCreateDescription = async (e, editor) => {
        const data = editor.getData();
        setDescription(data);
    }

    const handleCreateType = async (e) => {
        const value = e.target.value;
        setType(value);
    }

    const handleCreateParent = async (e) => {
        const value = e.target.value;
        setParent(value);
    }

    const handleCreateAssignee = async (e) => {
        const value = e.target.value;
        setAssignee(value);
    }

    const handleCreateReporter = async (e) => {
        const value = e.target.value;
        setReporter(value);
    }
    
    const handleCreatePriority = async (e) => {
        const value = e.target.value;
        setPriority(value);
    }

    const handleCreatePoint = async (e) => {
        const value = e.target.value;
        setPoint(Number(value));
    }

    const handleCreateProject = async (e) => {
        const value = e.target.value;
        setProject(value);
    }

    const handleCreateSprint = async (e) => {
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
                    statusId: item.status[0]?._id,
                    statusTitle: item.status[0]?.title,
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

    const createTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const taskData = {
            shortId: shortId,
            type: type,
            parent: parent,
            title: title,
            description: description,
            status: status,
            assignee: assignee,
            reporter: reporter,
            deadline: deadline,
            priority: priority,
            point: point,
            project: project,
            sprint: sprint,
            assigneeAvatar: assigneeAvatar
        }
        const res = await axios.post(Url("task"), taskData);
        if ((pageState) && (pageState == "active-sprint")) {
            fetchActiveSprint();
        }
        if ((pageState) && (pageState == "back-log")) {
            fetchBackLog();
        }
        setIsLoading(false);
        props?.onHide();
    }

    return (
        <>
            {" "}
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                {isLoading && <IsLoading />}

                <ModalBody>
                    <div className="create-task-modal">
                        <h4>Create Issue</h4>
                        <div className="type">
                            <h5>Type</h5>
                            <Form.Select onChange={handleCreateType}>
                                <option></option>
                                {typeValue.map((item, index) => {
                                    return (
                                        <option key={index} value={item}>{item}</option>
                                    )
                                })}
                            </Form.Select>
                        </div>
                        {type != "Task" ? (
                            <div className="parent">
                                <h5>Parent</h5>
                                <Form.Select onChange={handleCreateParent}>
                                    <option></option>
                                    {allTaskState && (
                                        allTaskState.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.title}</option>
                                            )
                                        })
                                    )}
                                </Form.Select>
                            </div>
                        ) : null}
                        <div className="title">
                            <h5>Title</h5>
                            <FormControl 
                                type="text"
                                name="title"
                                onChange={handleCreateTitle}
                            />
                        </div>
                        <div className="description">
                            <h5>Description</h5>
                            <CKEditor
                                editor={ClassicEditor}
                                onChange={handleCreateDescription}
                            />
                        </div>
                        <div className="assignee">
                            <h5>Assignee</h5>
                            <Form.Select onChange={handleCreateAssignee}>
                                <option></option>
                                {userState && (
                                    userState.map((item, index) => {
                                        return (
                                            <option key={index} value={item._id}>
                                                {item.firstName + " " + item.lastName}
                                            </option>
                                        )
                                    })
                                )}
                            </Form.Select>
                        </div>
                        <div className="reporter">
                            <h5>Reporter</h5>
                            <Form.Select onChange={handleCreateReporter}>
                                <option></option>
                                {userState && (
                                    userState.map((item, index) => {
                                        return (
                                            <option key={index} value={item._id}>
                                                {item.firstName + " " + item.lastName}
                                            </option>
                                        )
                                    })
                                )}
                            </Form.Select>
                        </div>
                        <div className="deadline">
                            <h5>Due date</h5>
                            <Calendar
                                onChange={setDeadline}
                                value={deadline}
                            />
                        </div>
                        <div className="priority">
                            <h5>Priority</h5>
                            <FormControl 
                                type="text"
                                name="title"
                                onChange={handleCreatePriority}
                            />
                        </div>
                        <div className="project">
                            <h5>Components</h5>
                            <Form.Select onChange={handleCreateProject}>
                                <option></option>
                                {projectValue && (
                                    projectValue.map((item, index) => {
                                        return (
                                            <option key={index} value={item}>{item}</option>
                                        )
                                    })
                                )}
                            </Form.Select>
                        </div>
                        <div className="sprint">
                            <h5>Sprint</h5>
                            <Form.Select onChange={handleCreateSprint}>
                                <option></option>
                                {sprintValue && (
                                    sprintValue.map((item, index) => {
                                        return (
                                            <option key={index} value={item._id}>{item.name}</option>
                                        )
                                    })
                                )}
                            </Form.Select>
                        </div>
                        <div className="point">
                            <h5>Story Points</h5>
                            <FormControl 
                                type="text"
                                name="priority"
                                onChange={handleCreatePoint}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={createTask}>
                        Create
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

export default CreateTaskModal;