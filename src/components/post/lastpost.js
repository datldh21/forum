import "./lastpost.scss";
import moment from "moment";
import parse from 'html-react-parser';

const LastPost = (props) => {
    const post = props?.post;
    const avatar = post?.user[0]?.avatar;
    const date = post?.date;
    const content = post?.content;

    return (
        <>
            {post ? (
                <div className="last-post">
                    <div className="line-1">
                        <div className="avatar-user">
                            <img src={avatar} />
                        </div>
                        <div className="date">
                            {moment(date).format('lll')}
                        </div>
                    </div>
                    <div className="content">
                        {parse(content)}
                    </div>
                </div>
            ) : (
                <div className="last-post">
                    <div className="content">No new posts</div>
                </div>
            )}
        </>
    )
}

export default LastPost;