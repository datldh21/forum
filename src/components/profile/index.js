import "./style.scss";
import { useParams, useHistory, Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import Url from "../../util/url";
import moment from "moment";

const Profile = () => {
    const userId = useParams().id;
    const history = useHistory();
    const dispatch = useDispatch();
    const infoUser = useSelector((state) => state.infoUser[0]);

    const fetchInfoUser = async () => {
        const res = await axios.get(Url("user/info/" + userId));
        dispatch({ type: "SET_INFO_USER", data: res?.data?.response });
    }

    useEffect(() => {
        fetchInfoUser();
    }, []);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    return (
        <div className="profile container">
            {infoUser && (
                <>
                    <div className="title">
                        <div className="home" onClick={() => clickHome()}>
                            Home
                        </div>
                        <div className="category-name">
                            / {infoUser.userName}
                        </div>
                    </div>

                    <div className="content">
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
                </>
            )}
        </div>
    )
}

export default Profile;