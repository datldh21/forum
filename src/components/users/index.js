import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import Url from "../../util/url";
import { useHistory, Redirect } from "react-router";

const Users = () => {
    
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchUsers = async () => {
        const res = await axios.get(Url("user/total"));
        dispatch({ type: "SET_USERS", data: res?.data?.response });
    } 

    useEffect(() => {
        fetchUsers();
    }, []);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
    }

    const clickUser = (userId) => {
        history.push({ pathname: `/user/${userId}` });
        <Redirect to='/user' />
    }

    return (
        <div className="users container">
            <div className="title">
                <div className="home" onClick={() => clickHome()}>
                    Home
                </div>
                <div className="category-name">
                    / Users
                </div>
            </div>

            <div className="content">
                {users && users.length > 0 && users.map((user, index) => {
                    return (
                        <div className="user" key={index} onClick={() => clickUser(user._id)}>
                            <div className="user-avatar">
                                <img 
                                    src={user.avatar} 
                                    style={{ width: "65px", height: "65px", borderRadius: "65px", objectFit: "cover"}}    
                                />
                            </div>
                            <div className="user-name">
                                {user.userName}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Users;
