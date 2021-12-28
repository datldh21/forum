import "./style.scss";
import Status from "./status";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Url from "../../util/url";
import { Fragment, useEffect, useState, useRef } from "react";
import Task from "./task";
import Column from "./Column/";
import { Button } from "react-bootstrap";
import CreateTaskModal from "./task/createTaskModal";
import moment from "moment";
import Logo from "../../assets/images/logo.svg";
import { Redirect, useHistory } from "react-router";
import SearchIcon from "../../assets/images/Search.svg";
import { connect } from 'react-redux';
import ModalMoreUsers from "./modal-more-users";

const Dashboard = (users) => {

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const taskState = useSelector((state) => state.task?.data);
    const sprintTaskState = useSelector((state) => state.sprintTask?.data);
    const statusState = useSelector((state) => state.status);
    const userState = useSelector((state) => state.user);
    const sprintState = useSelector((state) => state.sprint);
    const projectValue = useSelector((state) => state.credit.project);
    const [searchInput, setSearchInput] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [showModalMoreUsers, setShowModalMoreUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const activeSprint = sprintState && sprintState.length > 0 && sprintState.filter((item) => item.activeSprint == true);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
    }

    useEffect(() => {
        if (searchInput !== "" ) {
            const filterTask = taskState && taskState.filter((item) => {
                return Object.values(item.title).join("").toLowerCase().includes(searchInput.toLowerCase());
            });
            setFilteredResults(filterTask);
        } else {
            setFilteredResults(taskState);
        }
    }, [searchInput]);

    const fetchAllSprint = async () => {
        const res = await axios.get(Url("sprint"));
        dispatch({
            type: "SET_SPRINT",
            data: res?.data?.response
        });
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
        setSelectedUser(null);
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
                }
            });
            dispatch({ type: "SET_TASK", data: data && data });
            dispatch({ type: "SET_SPRINT_TASK", data: data });
            return data;
        } else {
            dispatch({ type: "SET_TASK", data: null });
        }
    }

    const fetchAllTask = async () => {
        const res = await axios.get(Url("task"));
        if (res.data.success) {
            const data = res.data?.response.map((item) => {
                return {
                    id: item._id,
                    title: item.title,
                }
            });
            dispatch({ type: "SET_ALL_TASK", data: data });
            return data;
        } else {
            dispatch({ type: "SET_ALL_TASK", data: null });
        }
    }

    const fetchUserTask = async (sprintId, userId) => {
        const data = sprintTaskState && sprintTaskState.length > 0 && sprintTaskState.filter((task) => task?.assignee[0]?._id == userId && task?.sprint[0]?._id == sprintId);
        dispatch({ type: "SET_TASK", data: data });
        setSelectedUser(userId);
    }

    const fetchProjectTask = async (project) => {
        const data = sprintTaskState && sprintTaskState.length > 0 && sprintTaskState.filter((task) => task.project == project);
        dispatch({ type: "SET_TASK", data: data });
    }

    const fetchStatus = async () => {
        const res = await axios.get(Url("status"));
        res.data.success && dispatch({ type: "SET_STATUS", data: res.data.response });
    }

    const fetchAllUser = async () => {
        const resTotal = await axios.get(Url('point/rankings'));
        dispatch({
            type: 'GET_ALL_USER',
            data: resTotal?.data?.response
        });
    }

    useEffect(() => {
        fetchAllUser();
        fetchStatus();
        fetchAllTask();
        fetchAllSprint();
        fetchActiveSprint();
    }, []);

    const statusSorted = [];

    const sortStatusbyId = () => {
        for (let i = 0; i < statusState.length; i++) {
            for (let j = i; j < statusState.length; j++) {
                if (statusState[i].next == statusState[j]._id) {
                    statusSorted.push(statusState[j]);
                } else if (statusState[j].prev == null) {
                    statusSorted.unshift(statusState[j]);
                }
            }
        }
    }

    sortStatusbyId();

    const handleClick = () => {
        setShowCreateTaskModal(true);
    };

    const handleClickMoreUsers = () => {
        setShowModalMoreUsers(true);
        setSelectedUser(null);
    }

    let menuRef = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setShowModalMoreUsers(false)
            }
        });
    });

    const clickBackLog = () => {
        history.push({ pathname: '/back-log' });
        <Redirect to='/back-log' />
    }

    const clickActiveSprint = () => {
        history.push({ pathname: '/active-sprint' });
        <Redirect to='/active-sprint' />
    }

    const clickNextSprint = () => {
        history.push({ pathname: '/next-sprint' });
        <Redirect to='/next-sprint' />
    }

    return (
        <div className="container dashboard-jira">
            <div className="button-line">
                <>
                    <Button className="add-task" onClick={handleClick}>
                        Thêm Task
                    </Button>
                    <CreateTaskModal
                        show={showCreateTaskModal}
                        onHide={() => setShowCreateTaskModal(false)}
                    />
                </>
                <div className="active-sprint-active-btn"><p onClick={() => clickActiveSprint()}>Active Sprint</p></div>
                <div className="back-log-btn"><p onClick={() => clickBackLog()}>Back Log</p></div>
                <div className="next-sprint-btn"><p onClick={() => clickNextSprint()}>Next Sprint</p></div>
            </div>
            
            <div className="dashboard-screen">
                <div className="dashboard-task">
                    <div className="body">
                        <div className="sprint-name">
                            {sprintState.length > 0 && sprintState.map((item, index) => {
                                if (item.activeSprint == true) {
                                    return (
                                        <div key={index}>
                                            <h2>{item.name}</h2>
                                        </div>
                                    )
                                }
                            })}
                        </div>

                        <div className="component-filter">
                            <div className="wrap" onClick={() => fetchActiveSprint()}><p>All Project</p></div>
                            {projectValue && projectValue.length > 0 && projectValue.map((item, index) => {
                                return (
                                    <div className="wrap" onClick={() => fetchProjectTask(item)} key={index}>
                                        <p>{item}</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="line-1">
                            <div className="search-task">
                                <img className="icon" src={SearchIcon} />
                                <input 
                                    type="text" 
                                    placeholder="Search"
                                    onChange={(e) => searchItems(e.target.value)}
                                />
                            </div>
                        
                            <div className="avatar-user" ref={menuRef}>
                                <div style={{margin: "0px 10px"}} onClick={() => fetchActiveSprint()}>
                                    <img className="logo" src={Logo} />
                                    <p style={{textAlign: "center"}}>Tất cả</p>
                                </div>
                                {activeSprint && userState.length > 0 && userState.slice(0, 3).map((item, index) => {
                                    var sprintId = activeSprint[0]?._id;
                                    return (
                                        <div 
                                            style={{margin: "0px 10px"}} 
                                            onClick={() => {
                                                fetchUserTask(sprintId, item._id)
                                                setShowModalMoreUsers(false)
                                            }}
                                        >
                                            {selectedUser == item._id ? (
                                                <img className="active-user-avatar" key={index} src={item.avatar} />
                                            ) : (
                                                <img className="unactive-user-avatar" key={index} src={item.avatar} />
                                            )}
                                            <p style={{textAlign: "center"}}>{item.lastName}</p>
                                        </div>                                        
                                    )
                                })}

                                {userState.length > 3 && (
                                    <div className="more-users" onClick={() => handleClickMoreUsers()}>
                                        <p>+{userState.length - 3}</p>
                                    </div>
                                )}
                                {showModalMoreUsers && (
                                    <ModalMoreUsers 
                                        show={true}
                                        onHide={() => setShowModalMoreUsers(false)}
                                        sprintId={activeSprint[0]?._id}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="list-task">
                            {statusState.length > 0 && statusState.map((item, index) => {
                                return (
                                    <Column key={index} columnId={item._id}>
                                        <div className="box-status">
                                            <Status status={item} />
                                        </div>
                                        {searchInput.length > 0 && filteredResults ? (
                                            filteredResults.map((task) => {
                                                if ((task.statusId == item._id) && (task.type == "Task")) {
                                                    return (
                                                        <Fragment key={task.id}>
                                                            <Task task={task} />
                                                        </Fragment>
                                                    )
                                                }
                                            })
                                        ) : (
                                            taskState && taskState.map((task) => {
                                                if ((task.statusId == item._id) && (task.type == "Task")) {
                                                    return (
                                                        <Fragment key={task.id}>
                                                            <Task task={task} />
                                                        </Fragment>
                                                    )
                                                } else {
                                                    return null;
                                                }
                                            }
                                        ))}
                                    </Column>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state, props) {
    return {
        users: state.user,
    }
}

export default connect(mapStateToProps, {})(Dashboard);