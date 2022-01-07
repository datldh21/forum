import "./style.scss";
import axios from "axios";
import Url from "../../../util/url";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Fragment } from "react";
import { useParams } from "react-router";
import postCount from "../../../assets/images/post/post.svg";
import voteCount from "../../../assets/images/post/like.svg";
import viewCount from "../../../assets/images/post/view.svg";
import Button from "react-bootstrap/Button";
import Post from "..";

const TopicPosts = () => {
    const topicId = useParams().id;
    const dispatch = useDispatch();
    const topicPosts = useSelector((state) => state.topicPosts);
    const topic = useSelector((state) => state?.topics[0]);

    console.log(topicPosts);
    
    const fetchTopicPosts = async () => {
        const res = await axios.get(Url("post/topic/" + topicId));
        if (res.data.success) {
            dispatch({ type: "SET_TOPIC_POSTS", data: res.data?.response });
        } else {
            dispatch({ type: "SET_TOPIC_POSTS", data: null });
        }
    }
    
    const fetchTopic = async () => {
        const res = await axios.get(Url("topic/" + topicId));
        dispatch({ type: "SET_TOPICS", data: res?.data?.response });
    }

    useEffect(() => {
        fetchTopicPosts();
        fetchTopic();
    }, []);

    return (
        <div className="topic-posts container">
            {topic && (
                <div className="topic">
                    <div className="topic-name">{topic?.name}</div>
                    <div className="info-topic-line">
                        <div className="left">
                            <div className="category-icon"><img src={topic?.category[0]?.icon}/></div>
                            <div className="category-name">{topic?.category[0]?.name}</div>
                            <div className="posts-count">
                                <img className="icon" src={postCount} />
                                <div className="quantity">{topic?.postCount}</div>
                            </div>
                            <div className="votes-count">
                                <img className="icon" src={voteCount} />
                                <div className="quantity">{topic?.voteCount}</div>
                            </div>
                            <div className="views-count">
                                <img className="icon" src={viewCount} />
                                <div className="quantity">{topic?.viewCount}</div>
                            </div>
                        </div>
                        <Button className="reply">Reply</Button>
                    </div>
                </div>
            )}

            {topicPosts && topicPosts.length > 0 && (
                <div className="posts">
                    {topicPosts.map((post, index) => {
                        return (
                            <Fragment key={index}>
                                <Post post={post} />
                            </Fragment>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default TopicPosts;