import "./style.scss";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Url from "../../util/url";
import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";

const SignUp = () => {
    const [userName, setUserName] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [gender, setGender] = useState(null);
    const [joinDate, setJoinDate] = useState(new Date());
    const [birthday, setBirthday] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const history = useHistory();

    const signup = async () => {
        const data = {
            userName: userName,
            fullName: fullName,
            gender: gender,
            joinDate: joinDate,
            birthday: birthday,
            avatar: avatar,
            email: email,
            password: password,
            role: "member",
            notice: false,
            banned: false,
            aboutMe: null
        }
        const res = await axios.post(Url("user/new"), data);
        history.push({ pathname: "/login" });
        <Redirect to="/login" />
    }

    return (
        <div className="signup">
            <div className="title">
                Sign Up
            </div>

            <div className="content-signup">
                <div className="form-group">
                    <div className="create-username">User name</div>
                    <input 
                        type="text"
                        placeholder="User Name"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div className="create-fullname">Full name</div>
                    <input 
                        type="text"
                        placeholder="Full Name"
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div className="create-gender">Gender</div>
                    <select placeholder="Gender" onChange={(e) => setGender(e.target.value)}>
                        <option>Gender</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Female"}>Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <div className="create-birthday">Birthday</div>  
                    <input
                        type="date"
                        placeholder="dd/mm/yyyy"
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div className="create-avatar">Avatar</div>
                    <input
                        type="text"
                        placeholder="Url avatar"
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div className="create-email">Email</div>
                    <input 
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div className="create-password">Password</div>
                    <input 
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button className="signup-btn" onClick={signup}>
                    Sign Up
                </Button>
            </div>

            <a href={"/login"} style={{textAlign: "center", marginTop: "15px"}}>
                You have account?
            </a>
        </div>
    )
}

export default SignUp;