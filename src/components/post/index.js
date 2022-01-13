import "./style.scss";
import moment from "moment";
import like from "../../assets/images/post/like.svg";
import dislike from "../../assets/images/post/dislike.svg";
import edit from "../../assets/images/post/edit.svg";
import EditPost from "../modal/post/editPost";
import { useState } from "react";
import { useSelector } from "react-redux";
import parse from 'html-react-parser';
import axios from "axios";
import Url from "../../util/url";
import { useDispatch } from "react-redux";

const Post = (props) => {
    const post = props?.post;
    const dispatch = useDispatch();
    const headerInfo = useSelector((state) => state.headerInfo);
    const [showEditPostModal, setShowEditPostModal] = useState(false);

    const fetchTopic = async (topicId) => {
        const res = await axios.get(Url("topic/" + topicId));
        dispatch({ type: "SET_TOPICS", data: res?.data?.response });
    }

    const LikeClick = async () => {
        const updateVotesPost = await axios.patch(Url("post/votes/inc/" + post._id));
        const updateVotesTopic = await axios.patch(Url("topic/voteCount/inc/" + post.topicId));
        fetchTopic(post.topicId);
    }

    const DislikeClick = async () => {
        const updateVotesPost = await axios.patch(Url("post/votes/dec/" + post._id));
        const updateVotesTopic = await axios.patch(Url("topic/voteCount/dec/" + post.topicId));
        fetchTopic(post.topicId);
    }

    return (
        <div className="post">
            <div className="user-avatar">
                <img src={post?.user[0]?.avatar} />
            </div>
            <div className="column">
                <div className="line-1">
                    <div className="user-name">{post?.user[0]?.userName}</div>
                    <div className="date">{moment(post?.date).format("LLL")}</div>
                </div>
                <div className="content">{parse(post?.content)}</div>
                <div className="line-3">
                    <div className="reply">Reply</div>
                    {post.userId == headerInfo._id ? (
                        <>
                            <div className="edit" onClick={() => setShowEditPostModal(true)}>
                                Edit
                            </div>
                            {showEditPostModal && (
                                <EditPost
                                    id={post._id}
                                    show={showEditPostModal}
                                    onHide={() => setShowEditPostModal(false)}
                                />
                            )}
                        </>
                    ) : null}
                    <div className="like" onClick={() => LikeClick()}><img src={like}/></div>
                    <div className="votes">{post?.votes}</div>
                    <div className="dislike" onClick={() => DislikeClick()}><img src={dislike}/></div>
                </div>
            </div>
        </div>
    )
}

export default Post;