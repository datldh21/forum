import "./header.scss";
import categories from "../../assets/images/header/category.svg";
import recent from "../../assets/images/header/recent.svg";
import popular from "../../assets/images/header/popular.svg";
import users from "../../assets/images/header/user.svg";
import notification from "../../assets/images/header/notification.svg";
import search from "../../assets/images/header/search.svg";
import logout from "../../assets/images/header/logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router";
import axios from "axios";
import Url from "../../util/url";
import { useEffect, useState } from "react";
import Notifications from "../notifications";
import { useRef } from "react";
import RedDot from "../../assets/images/red-dot.svg";

const Header = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    let menuRef = useRef();
    const [showNotifications, setShowNotifications] = useState(false);
    const headerInfo = useSelector((state) => state.headerInfo);
    const userAvatar = headerInfo?.avatar;
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userID = userInfo?._id;
    const notifications = useSelector((state) => state.notifications);
    const page = useSelector((state) => state.page);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
    }

    const fetchNotifications = async () => {
        const res = await axios.get(Url("notifications/user/" + userID));
        if (res.data.success) {
            dispatch({ type: "SET_NOTIFICATIONS", data: res.data?.response});
        } else {
            dispatch({ type: "SET_NOTIFICATIONS", data: null });
        }
    }

    const fetchHeaderInfo = async () => {
        const res = await axios.get(Url("user/info/" + userID));
        res.data.success && dispatch({ type: "SET_HEADER_INFO", data: res.data.response[0] });
    }

    useEffect(() => {
        let handler = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setShowNotifications(false)
            }
        }
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    useEffect(() => {
        fetchNotifications();
    }, [userID]);

    const logOut = () => {
        window.localStorage.removeItem("userInfo");
        window.location.href = "/";
    };

    const clickNotification = async () => {
        setShowNotifications(true);
        const updateNoticeData = {
            notice: false
        }
        const res = await axios.patch(Url("user/info/" + userID), updateNoticeData);
        fetchHeaderInfo();
    }

    return (
        <>
            {page != null && page != "" && (
                <div className="header container">
                    <div className="column-1">
                        <div className="software-name" onClick={() => clickHome()}>
                            FORUM
                        </div>
                        <a className="categories" title="Categories" href={'/'} style={{cursor: "pointer"}}>
                            <img src={categories} />
                        </a> 
                        <a className="recent" title="Recent" href={'/recent'} style={{cursor: "pointer"}}>
                            <img src={recent} />
                        </a>
                        <a className="popular" title="Popular" href={'/popular'} style={{cursor: "pointer"}}>
                            <img src={popular} />
                        </a>
                        <a className="users" title="Users" href={'/users'} style={{cursor: "pointer"}}>
                            <img src={users} />
                        </a>
                        <a className="search" title="Search" href={'/search'} style={{cursor: "pointer"}}>
                            <img src={search} />
                        </a>
                    </div>

                    <div className="column-2" ref={menuRef}>
                        <div 
                            className="notification-icon" 
                            title="Notifications" 
                            onClick={() => clickNotification()}
                            style={{cursor: "pointer"}}
                        >
                            <img src={notification} />
                            {headerInfo.notice == true && (
                            <img className="red-dot" src={RedDot} />
                        )}
                        </div>
                        {showNotifications && (
                            <Notifications
                                show={showNotifications}
                                notifications={notifications}
                                onHide={() => setShowNotifications(false)}
                            />
                        )}
                        <a className="user-avatar" href={'/user/' + userID}>
                            <img src={userAvatar} />
                        </a>
                        <div className="log-out" onClick={() => logOut()}>
                            <img src={logout} />
                        </div>
                    </div>
                </div>  
            )}
        </>    
    )
};
export default Header;
