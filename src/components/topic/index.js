import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Url from "../../util/url";
import axios from "axios";
import ShowTopic from "./showTopic";
import CreateTopic from "../modal/topic/createTopic";

const Topic = () => {
    const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
    const topics = useSelector((state) => state.topics);
    const categoryNow = useSelector((state) => state.categoryNow);
    const headerInfo = useSelector((state) => state.headerInfo);
    const categoryId = useParams().id;
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchTopics = async () => {
        const res = await axios.get(Url("topic/category/" + categoryId));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        }
    }

    const fetchCategories = async () => {
        const res = await axios.get(Url("category"));
        dispatch({ type: "SET_CATEGORIES", data: res?.data?.response });
    }

    const fetchCategoryNow = async () => {
        const res = await axios.get(Url("category/" + categoryId));
        dispatch({ type: "SET_CATEGORY_NOW", data: res?.data?.response });
    }
    
    useEffect(() => {
        fetchTopics();
        fetchCategories();
        fetchCategoryNow();
    }, []);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="topics container">
            {categoryNow && (
                <div className="title">
                    <div className="home" onClick={() => clickHome()}>
                        Home
                    </div>
                    <div className="category-name">
                        / {categoryNow[0].name}
                    </div>
                </div>
                )}

            {headerInfo.banned == false && (
                <div className="button">
                    <Button className="new-topic" onClick={() => setShowCreateTopicModal(true)}>
                        New Topic
                    </Button>
                </div>
            )}
            
            {showCreateTopicModal && (
                <CreateTopic
                    show={showCreateTopicModal}
                    onHide={() => setShowCreateTopicModal(false)}
                />
            )}

            {topics != null ? (
                <ShowTopic
                    topics={topics}
                />
            ) : (
                <div className="no-new-posts">No new posts</div>
            )}

        </div>
    )
}

export default Topic;