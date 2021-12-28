import "./style.scss";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Url from "../../../util/url";
import { Fragment, useEffect, useState } from "react";
import Task from "../task/index";
import { Button } from "react-bootstrap";
import CreateTaskModal from "../task/createTaskModal";
import moment from "moment";
import { Redirect, useHistory } from "react-router";
import SearchIcon from "../../../assets/images/Search.svg";

const NextSprint = () => {
    
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const nextSprintTaskState = useSelector((state) => state.nextSprintTask[0]);
    const [searchInput, setSearchInput] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
    }

    useEffect(() => {
        if (searchInput !== "" ) {
            const filterTask = nextSprintTaskState && nextSprintTaskState.filter((item) => {
                return Object.values(item.title).join("").toLowerCase().includes(searchInput.toLowerCase());
            });
            setFilteredResults(filterTask);
        } else {
            setFilteredResults(nextSprintTaskState);
        }
    }, [searchInput]);

    const fetchAllSprint = async () => {
        const res = await axios.get(Url("sprint"));
        dispatch({
            type: "SET_SPRINT",
            data: res?.data?.response
        });
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
                    statusTitle: item.status[0].title,
                    parent: item.parent,
                    shortId: item.shortId,
                    assigneeAvatar: item.assigneeAvatar,
                }
            });
            dispatch({ type: "SET_NEXT_SPRINT_TASK", data: data });
            return data;
        } else {
            dispatch({ type: "SET_NEXT_SPRINT_TASK", data: null });
        }
    }

    const fetchNextSprint = async () => {
        const res = await axios.get(Url("sprint"));
        var index;
        const dt = res.data.response;
        if (res.data.success) {
            if (dt) {
                for (let i = 0; i < dt.length; i++) {
                    if (dt[i].activeSprint == true) {
                        index = i;
                    }
                }
            }
        }
        
        for (let i = index + 1; i < dt.length; i++) {
            fetchSprintTask(dt[i]._id);
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
    
    const fetchAllUser = async () => {
        const resTotal = await axios.get(Url('point/rankings'));
        dispatch({
            type: 'GET_ALL_USER',
            data: resTotal?.data?.response
        });
    }

    const fetchStatus = async () => {
        const res = await axios.get(Url("status"));
        res.data.success && dispatch({ type: "SET_STATUS", data: res.data.response });
    }
    
    useEffect(() => {
        fetchAllSprint();
        fetchAllUser();
        fetchAllTask();
        fetchStatus();
        fetchNextSprint();
    }, []);

    const handleClick = () => {
        setShowCreateTaskModal(true);
    };

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
        <Redirect to = "/next-sprint" />
    }

    return (
        <div className="container next-sprint">
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
                <div className="active-sprint-btn"><p onClick={() => clickActiveSprint()}>Active Sprint</p></div>
                <div className="back-log-btn"><p onClick={() => clickBackLog()}>Back Log</p></div>
                <div className="next-sprint-active-btn"><p onClick={() => clickNextSprint()}>Next Sprint</p></div>
            </div>

            <div className="next-sprint-screen">
                <div className="next-sprint-task">
                    <div className="sprint-name">
                        <h2>Next Sprint</h2>
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

                    </div>

                    <div className="list-task-next-sprint">
                        {searchInput.length > 0 && filteredResults ? (
                            filteredResults.map((task) => {
                                return (
                                    <Fragment key={task.id}>
                                        <Task task={task} />
                                    </Fragment>
                                )
                            })
                        ) : (
                            nextSprintTaskState && nextSprintTaskState.map((task) => {
                                return (
                                    <Fragment key={task.id}>
                                        <Task task={task} />
                                    </Fragment>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NextSprint;