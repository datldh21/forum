import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import Url from "../../util/url";
import { Button } from "react-bootstrap";

const EditInfo = () => {
    const infoUser = useSelector((state) => state.infoUser[0]);
    const history = useHistory();
    const dispatch = useDispatch();
    const userId = useParams().id;
    const [fullName, setFullName] = useState(undefined);
    const [avatar, setAvatar] = useState(undefined);
    const [birthday, setBirthday] = useState(undefined);
    const [aboutMe, setAboutMe] = useState(undefined);

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />
        dispatch({ type: "SET_TOPICS", data: null });
    }

    const fetchInfoUser = async () => {
        const res = await axios.get(Url("user/info/" + userId));
        dispatch({ type: "SET_INFO_USER", data: res?.data?.response });
    }

    const save = async () => {
        const data = {
            fullName: fullName,
            avatar: avatar,
            birthday: birthday,
            aboutMe: aboutMe,
        }
        const res = await axios.patch(Url("user/info/" + userId), data);
        console.log(res);
        history.push({ pathname: `/user/` + userId });
        <Redirect to='/user' />
    }

    useEffect(() => {
        fetchInfoUser();
    }, [fullName, avatar, birthday, aboutMe]);

    return (
        <div className="edit-info container">
            {infoUser && (
                <>
                    <div className="line-1">
                        <div className="title">
                            <div className="home" onClick={() => clickHome()}>
                                Home
                            </div>
                            <div className="category-name">
                                / {infoUser.userName} / Edit
                            </div>
                        </div>
                    </div>

                    <div className="content-profile">
                        <div className="column-1">
                            <div className="wrap-avatar">
                                <div className="user-avatar">
                                    <img src={infoUser.avatar} />
                                </div>
                            </div>
                            <div className="username">
                                @{infoUser.userName}
                            </div>
                            <div className="join-date">
                                Join Date: {moment(infoUser.joinDate).format("LL")}
                            </div>
                        </div>

                        <div className="column-2">
                            <div className="form-group">
                                <div className="edit-fullname">Full name</div>
                                <input 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <div className="edit-avatar">Avatar</div>
                                <input
                                    type="text"
                                    placeholder="Url avatar"
                                    onChange={(e) => setAvatar(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <div className="edit-birthday">Birthday</div>
                                <input
                                    type="date"
                                    placeholder="dd/mm/yyyy"
                                    onChange={(e) => setBirthday(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <div className="edit-about">About me</div>
                                <input
                                    type="text"
                                    placeholder="About"
                                    onChange={(e) => setAboutMe(e.target.value)}
                                />
                            </div>

                            <Button className="save-btn" onClick={save}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default EditInfo;