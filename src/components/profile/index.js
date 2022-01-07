import "./style.scss";
import { useParams, useHistory, Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Fragment } from "react";
import axios from "axios";
import Url from "../../util/url";
import moment from "moment";
import Post from "../post";

const Profile = () => {
    const userId = useParams().id;
    const history = useHistory();
    const dispatch = useDispatch();
    const infoUser = useSelector((state) => state.infoUser[0]);
    const userPosts = useSelector((state) => state.userPosts);

    const fetchInfoUser = async () => {
        const res = await axios.get(Url("user/info/" + userId));
        dispatch({ type: "SET_INFO_USER", data: res?.data?.response });
    }

    const fetchUserPosts = async () => {
        const res = await axios.get(Url("post/user/" + userId));
        dispatch({ type: "SET_USER_POSTS", data: res?.data?.response });
    }

    useEffect(() => {
        fetchInfoUser();
        fetchUserPosts();
    }, []);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="profile container">
            {infoUser && userPosts && userPosts.length > 0 && (
                <>
                    <div className="title">
                        <div className="home" onClick={() => clickHome()}>
                            Home
                        </div>
                        <div className="category-name">
                            / {infoUser.userName}
                        </div>
                    </div>

                    <div className="content-profile">
                        <div className="wrap-avatar">
                            <div className="user-avatar">
                                <img src={infoUser.avatar} />
                            </div>
                        </div>
                        <div className="fullname">
                            {infoUser.fullName}
                        </div>
                        <div className="username">
                            @{infoUser.userName}
                        </div>
                        <div className="join-date">
                            Join Date: {moment(infoUser.joinDate).format("LL")}
                        </div>
                        <div className="about">
                            About: {infoUser.aboutMe}
                        </div>
                    </div>

                    <div className="user-posts">
                        <div className="user-posts-title">Latest posts made by {infoUser.userName}</div>
                        {userPosts.map((post, index) => {
                            return (
                                <Fragment key={index}>
                                    <Post post={post}/>
                                </Fragment>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Profile;