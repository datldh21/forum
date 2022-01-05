import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router";
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Url from "../../util/url";
import axios from "axios";
import "./style.scss";
import ShowTopic from "../topic/showTopic";

const Recent = () => {

    const topics = useSelector((state) => state.topics);
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchTopics = async () => {
        const res = await axios.get(Url("topic/1/recent"));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        } else {
            dispatch({ type: "SET_TOPICS", data: null });
        }
    }

    useEffect(() => {
        fetchTopics();
    })

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="recent container">
            <div className="title">
                <div className="home" onClick={() => clickHome()}>
                    Home
                </div>
                <div className="category-name">
                    / Recent
                </div>
            </div>

            <div className="button">
                <Button className="new-topic">
                    New Topic
                </Button>
            </div>

            <ShowTopic 
                topics={topics}
            />
        </div>
    )
}

export default Recent;