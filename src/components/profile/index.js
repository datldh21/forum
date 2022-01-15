import "./style.scss";
import { useParams, useHistory, Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Fragment } from "react";
import axios from "axios";
import Url from "../../util/url";
import moment from "moment";
import Post from "../post";
import { Button } from "react-bootstrap";
import Edit from "../../assets/images/Edit.svg";

const Profile = () => {
    const userId = useParams().id;
    const history = useHistory();
    const dispatch = useDispatch();
    const infoUser = useSelector((state) => state.infoUser[0]);
    const userPosts = useSelector((state) => state.userPosts);
    const headerInfo = useSelector((state) => state.headerInfo);

    const fetchInfoUser = async () => {
        const res = await axios.get(Url("user/info/" + userId));
        dispatch({ type: "SET_INFO_USER", data: res?.data?.response });
    }

    const fetchUserPosts = async () => {
        const res = await axios.get(Url("post/user/" + userId));
        if (res.data.success) {
            dispatch({ type: "SET_USER_POSTS", data: res?.data?.response });
        } else {
            dispatch({ type: "SET_USER_POSTS", data: null });
        }
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

    const banUser = async () => {
        const dataUpdate = {
            banned: true
        }
        const ban = await axios.patch(Url("user/info/" + userId), dataUpdate);
        console.log(ban);
        fetchInfoUser();
    }

    const unbanUser = async () => {
        const dataUpdate = {
            banned: false
        }
        const ban = await axios.patch(Url("user/info/" + userId), dataUpdate);
        fetchInfoUser();
    }

    return (
        <div className="profile container">
            {infoUser && (
                <>
                    <div className="line-1">
                        <div className="title">
                            <div className="home" onClick={() => clickHome()}>
                                Home
                            </div>
                            <div className="category-name">
                                / {infoUser.userName}
                            </div>
                        </div>

                        {headerInfo.role == "admin" && infoUser.banned == false && (
                            <Button className="ban-btn" onClick={() => banUser()}>Ban</Button>
                        )}
                        
                        {headerInfo.role == "admin" && infoUser.banned == true && (
                            <Button className="unban-btn" onClick={() => unbanUser()}>Unban</Button>
                        )}
                    </div>

                    <div className="content-profile">
                        <div className="wrap-avatar">
                            <div className="user-avatar">
                                <img src={infoUser.avatar} />
                            </div>
                        </div>
                        <div className="fullname">
                            {infoUser.fullName}
                            {infoUser._id == headerInfo._id && (
                                <a href={"/user/editInfo/" + userId}>
                                    <img className="edit-icon" title="Edit Info" src={Edit} />
                                </a>
                            )}
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
                </>
            )}

            {infoUser && userPosts && userPosts.length > 0 ? (
                <>
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
            ) : (
                <div className="no-post">
                    This user hasn't post!
                </div>
            )}
        </div>
    )
}

export default Profile;