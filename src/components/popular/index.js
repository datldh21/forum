import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router";
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import moment from "moment";
import split from "../../assets/images/split.svg";
import LastPost from "../post/lastpost";
import Dropdown from 'react-bootstrap/Dropdown';
import Url from "../../util/url";
import axios from "axios";
import "./style.scss";

const Popular = () => {

    const topics = useSelector((state) => state.topics);
    const posts = useSelector((state) => state.posts);
    const history = useHistory();
    const dispatch = useDispatch();

    const fetchPosts = async () => {
        const res = await axios.get(Url("post"));
        dispatch({ type: "SET_POSTS", data: res?.data?.response })
    }

    const fetchTopics = async () => {
        const res = await axios.get(Url("topic/1/popular"));
        if (res.data.success) {
            dispatch({ type: "SET_TOPICS", data: res.data.response });
        } else {
            dispatch({ type: "SET_TOPICS", data: null });
        }
    }

    useEffect(() => {
        fetchPosts();
        fetchTopics();
    })

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    const lastPostInTopic = (id) => {
        if (posts && posts.length > 0) {
            for (let i = posts.length - 1; i >= 0; i--) {
                if (posts[i].topicId === id) {
                    return posts[i];
                }
            }
        }
    };

    return (
        <div className="popular container">
            <div className="title">
                <div className="home" onClick={() => clickHome()}>
                    Home
                </div>
                <div className="category-name">
                    / Popular
                </div>
            </div>

            <div className="button">
                <Button className="new-topic">
                    New Topic
                </Button>

                <Dropdown className="d-inline mx-2">
                    <Dropdown.Toggle id="dropdown-autoclose-true">
                    Sort by
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                    <Dropdown.Item href="#">Newest to Oldest</Dropdown.Item>
                    <Dropdown.Item href="#">Oldest to Newest</Dropdown.Item>
                    <Dropdown.Item href="#">Most Posts</Dropdown.Item>
                    <Dropdown.Item href="#">Most Views</Dropdown.Item>
                    <Dropdown.Item href="#">Most Votes</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {topics && topics.length > 0 && topics.map((topic, index) => {
                return (
                    <div className="content">
                        <div className="topic">
                            <div className="column-1">
                                <div className="user-avatar">
                                    <img src={topic?.user[0]?.avatar} />
                                </div>
                                <div className="text">
                                    <div className="name">{topic?.name}</div>
                                    <div className="date-and-username">
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

export default Popular;