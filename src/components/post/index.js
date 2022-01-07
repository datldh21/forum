import "./style.scss";
import moment from "moment";
import like from "../../assets/images/post/like.svg";
import dislike from "../../assets/images/post/dislike.svg";

const Post = (props) => {
    const post = props?.post;

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
                </div>
            </div>
        </div>
    )
}

export default Post;