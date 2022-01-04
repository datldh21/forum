import "./style.scss";
import split from "../../assets/images/split.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import Url from "../../util/url";
import { Redirect, useHistory } from "react-router";

const Category = (props) => {
    const category = props?.category;
    const name = category?.name;
    const description = category?.description;
    const icon = category?.icon;
    const topicCount = category?.topicCount;
    const postCount = category?.postCount;
    const id = category?._id;
    const history = useHistory()
    const dispatch = useDispatch();

    const fetchTopics = async (id) => {
        const res = await axios.get(Url("topic/category/" + id));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        } else {
            dispatch({ type: "SET_TOPICS", data: null });
        }
        dispatch({ type: "SET_CATEGORY_NAME", data: name });
    }
    
    const clickCategory = (id) => {
        fetchTopics(id);
        history.push({ pathname: '/topic' });
        <Redirect to="/topic" />
    }

    return (
        <div className="category">
            <div className="column-1">
                <div className="icon">
                    <img src={icon} />
                </div>
                <div className="text">
                    <div className="name" onClick={() => clickCategory(id)}>{name}</div>
                    <div className="description">{description}</div>
                </div>
            </div>
            <div className="column-2">
                <div className="topic-count">
                    <div className="quantity">{topicCount}</div>
                    <div className="topics">TOPICS</div>
                </div>
                <div className="post-count">
                    <div className="quantity">{postCount}</div>
                    <div className="posts">POSTS</div>
                </div>
                <img className="split" src={split} />
            </div>
        </div>
    )
}

export default Category;