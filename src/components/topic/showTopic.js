import "./showTopic.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Url from "../../util/url";
import moment from "moment";
import split from "../../assets/images/split.svg";
import LastPost from "../post/lastpost";
import axios from "axios";
import { useHistory, Redirect } from "react-router";

const ShowTopic = (props) => {
    const topics = props?.topics;
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchPosts = async () => {
        const res = await axios.get(Url("post"));
        dispatch({ type: "SET_POSTS", data: res?.data?.response })
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const lastPostInTopic = (id) => {
        if (posts && posts.length > 0) {
            for (let i = posts.length - 1; i >= 0; i--) {
                if (posts[i].topicId === id) {
                    return posts[i];
                }
            }
        }
    };

    const clickTopic = async (id) => {
        history.push({ pathname: `/topic/${id}` });
        const res = await axios.patch(Url("topic/viewCount/" + id));
        <Redirect to='/posts' />
    }

    return (
        <div>
            {topics && topics.length > 0 && topics.map((topic, index) => {
                return (
                    <div className="content" key={index}>
                        <div className="topic">
                            <div className="column-1">
                                <div className="user-avatar">
                                    <img src={topic?.user[0]?.avatar} />
                                </div>
                                <div className="text">
                                    <div className="name" onClick={() => clickTopic(topic?._id)}>
                                        {topic?.name}
                                    </div>
                                    <div className="date-and-username">
                                        <div className="category-icon">
                                            <img src={topic?.category[0]?.icon} />
                                        </div>
                                        <div className="category-name">
                                            {topic?.category[0]?.name} &#x26AC;
                                        </div>
                                        <div className="start-date">
                                            {moment(topic?.startDate).format("lll")} &#x26AC;
                                        </div>
                                        <div className="username">{topic?.user[0]?.userName}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="vote-count">
                                    <div className="quantity">{topic?.voteCount}</div>
                                    <div className="votes">VOTES</div>
                                </div>
                                <div className="post-count">
                                    <div className="quantity">{topic?.postCount}</div>
                                    <div className="posts">POSTS</div>
                                </div>
                                <div className="view-count">
                                    <div className="quantity">{topic?.viewCount}</div>
                                    <div className="views">VIEWS</div>
                                </div>
                                <img className="split" src={split} />
                            </div>
                        </div>

                        <LastPost
                            post={lastPostInTopic(topic._id)}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default ShowTopic;