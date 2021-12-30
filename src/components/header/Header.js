import "./header.scss";
import categories from "../../assets/images/header/category.svg";
import unread from "../../assets/images/header/unread.svg";
import recent from "../../assets/images/header/recent.svg";
import tags from "../../assets/images/header/tag.svg";
import popular from "../../assets/images/header/popular.svg";
import users from "../../assets/images/header/user.svg";
import notification from "../../assets/images/header/notification.svg";
import group from "../../assets/images/header/group.svg";
import search from "../../assets/images/header/search.svg";

const Header = () => {
    return (
        <div className="header container">
            <div className="column-1">
                <div className="software-name">
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
                <div className="tags">
                    <img src={tags} />
                </div>
                <div className="popular">
                    <img src={popular} />
                </div>
                <div className="users">
                    <img src={users} />
                </div>
                <div className="group">
                    <img src={group} />
                </div>
            </div>

            <div className="column-2">
                <div className="search">
                    <img src={search} />
                </div>
                <div className="notification">
                    <img src={notification} />
                </div>
            </div>
        </div>
    )
};
export default Header;
