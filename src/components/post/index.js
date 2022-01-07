import "./style.scss";
import moment from "moment";
import like from "../../assets/images/post/like.svg";
import dislike from "../../assets/images/post/dislike.svg";
import edit from "../../assets/images/post/edit.svg";
import EditPost from "../modal/post/editPost";
import { useState } from "react";
import { useSelector } from "react-redux";

const Post = (props) => {
    const post = props?.post;
    const headerInfo = useSelector((state) => state.headerInfo);
    const [showEditPostModal, setShowEditPostModal] = useState(false);

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
                <div className="content">{post?.content}</div>
                <div className="line-3">
                    <div className="reply">Reply</div>
                    <div className="quote">Qoute</div>
                    <div className="like"><img src={like}/></div>
                    <div className="votes">{post?.votes}</div>
                    <div className="dislike"><img src={dislike}/></div>
                    {post.userId == headerInfo._id ? (
                        <>
                            <div className="edit" onClick={() => setShowEditPostModal(true)}>
                                <img src={edit}/>
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
                </div>
            </div>
        </div>
    )
}

export default Post;