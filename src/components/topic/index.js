import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect, useParams } from "react-router";
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Url from "../../util/url";
import axios from "axios";
import ShowTopic from "./showTopic";

const Topic = () => {
    const topics = useSelector((state) => state.topics);
    const categoryName = useSelector((state) => state.categoryName);
    const categoryId = useParams().id;
    const categories = useSelector((state) => state.categories);
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchTopics = async () => {
        const res = await axios.get(Url("topic/category/" + categoryId));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        } else {
            dispatch({ type: "SET_TOPICS", data: null });
            dispatch({ type: "SET_CATEGORY_NAME", data: null });
        }
    }

    const fetchCategories = async () => {
        const res = await axios.get(Url("category"));
        dispatch({ type: "SET_CATEGORIES", data: res?.data?.response });
    }

    if (categories && categories.length > 0) {
        categories.map((category) => {
            if (category._id === categoryId) {
                dispatch({ type: "SET_CATEGORY_NAME", data: category.name });
            }
        })
    }
    
    useEffect(() => {
        fetchTopics();
        fetchCategories();
    }, []);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="topics container">
            <div className="title">
                <div className="home" onClick={() => clickHome()}>
                    Home
                </div>
                <div className="category-name">
                    / {categoryName}
                </div>
            </div>

            <div className="button">
                <Button className="new-topic">
                    New Topic
                </Button>
            </div>

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