import "./header.scss";
import categories from "../../assets/images/header/category.svg";
import unread from "../../assets/images/header/unread.svg";
import recent from "../../assets/images/header/recent.svg";
import popular from "../../assets/images/header/popular.svg";
import users from "../../assets/images/header/user.svg";
import notification from "../../assets/images/header/notification.svg";
import search from "../../assets/images/header/search.svg";
import logout from "../../assets/images/header/logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router";

const Header = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const headerInfo = useSelector((state) => state.headerInfo);
    const userAvatar = headerInfo?.avatar;

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    const logOut = () => {
        window.localStorage.removeItem("userInfo");
        window.location.href = "/";

    };

    return (
        <div className="header container">
            <div className="column-1">
                <div className="software-name" onClick={() => clickHome()}>
                    FORUM
                </div>
                <div className="categories">
                    <img src={categories} />
                </div> 
                <div className="unread">
                    <img src={unread} />
                </div>
                <div className="recent">
                    <img src={recent} />
                </div>
                <div className="popular">
                    <img src={popular} />
                </div>
                <div className="users">
                    <img src={users} />
                </div>
            </div>

            <div className="column-2">
                <div className="search">
                    <img src={search} />
                </div>
                <div className="notification">
                    <img src={notification} />
                </div>
                <div className="user-avatar">
                    <img src={userAvatar} />
                </div>
                <div className="log-out" onClick={() => logOut()}>
                    <img src={logout} />
                </div>
            </div>
        </div>
    )
};
export default Header;
