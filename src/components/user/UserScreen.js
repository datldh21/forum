import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Url from "../../util/url";
import { useParams } from "react-router";
import moment from "moment";
import ChangePointModal from "../home/ChangePointModal";
import { useDispatch, useSelector } from "react-redux";
import HistoryPointTable from "../home/HistoryPointTable";
import Feedback from "../feedback";

const UserScreen = (props) => {
    const dispatch = useDispatch();
    const pointBonus = useSelector((state) => state.userbonus);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentId = userInfo._id;
    const role = userInfo.role;
    const userId = useParams().id;
    const [modalShow, setModalShow] = useState(false);
    const [type, setType] = useState(false);
    const [bonus, setBonus] = useState([]);
    const [dt, setData] = useState([]);
    const [fb, setFeedback] = useState([]);
    const [error, setError] = useState(false);
    const [errorNoData, setErrorNoData] = useState(false);
    const userInfoState = useSelector((state) => state.myProfile.userInfo);
    const feedbackState = useSelector((state) => state.feedback);

    useEffect(async () => {
        try {
            getUserInfo();
            getFeedback();
            getBonus();
        } catch (error) {
            console.log(error);
        }
    }, []);

    
    const getUserInfo = async () => {
        const res = await axios.get(Url("user/info/") + userId);
        if (res?.data?.success) {
            const dataMap =
            res?.data?.success &&
            res?.data?.response?.map((item) => {
                    return {
                        _id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        gender: item.gender,
                        position: item.position,
                        startDate: item.startDate,
                        role: item.role,
                        avatar: item.avatar,
                        point: item.point,
                        credit: item.credit,
                        totalScore: item.totalScore,
                    };
                });
            setData(dataMap);
            dispatch({ type: "SET_USER_INFO", data: dataMap[0] });
        } else {
            setErrorNoData(true);
        }
    };

    const getFeedback = async () => {
        const res = await axios.get(Url("comment/get-comment/") + userId);
        const data = res?.data;
        const response = data?.response;
        if (data?.success) {
            const feedback =
            role == 1 || currentId == userId
            ? response
            : response?.filter((element) => !element.hide);
            const feedbackMap =
            res?.data?.success &&
            feedback?.map((item) => {
                return {
                    strength: item.strength,
                    weakness: item.weakness,
                    target: item.target,
                    month: item.month,
                    year: item.year,
                    id: item._id,
                    userId: item.userId
                };
            });
            setFeedback(feedbackMap);
            dispatch({ type: "SET_USER_FEEDBACK", data: feedbackMap });
        } else {
            setError(true);
        }
    };
    
    const getBonus = async () => {
        const bonus = await axios.get(Url("point/user/") + userId);
        const data = bonus?.data;
        const response = data?.response;
        if (data?.success) {
            const historyPoint =
            role == 1 || currentId == userId
            ? response
            : response?.filter((element) => !element.hide);
            const bonusMap =
            bonus?.data?.success &&
            historyPoint?.map((item) => {
                return {
                    userId: item.userId,
                    point: item.point,
                    name: item.firstName + " " + item.lastName,
                    reason: item.reason,
                    avatar: item.avatar,
                    role: item.role,
                    date: moment(item.edit_date).format("DD/MM"),
                };
            });
            setBonus(bonusMap);
            dispatch({ type: "SET_BONUS_BY_USER", data: bonusMap });
        } else {
            setError(true);
        }
    };

    const handleClick = (show, type) => {
        setModalShow(show);
        setType(type);
    };

    return (
        <>
            {role == 1 && (
                <div className="btn-mode">
                    <div style={{ textAlign: "center" }}>
                        <Button onClick={() => handleClick(true, true)}>Thưởng</Button>
                        <Button onClick={() => handleClick(true, false)}>Phạt</Button>
                    </div>
                </div>
            )}
            <div className="profile container">
                <div className="history-point">
                    <div>
                        <HistoryPointTable bonus={pointBonus} actionShow={false} />
                    </div>
                </div>
                {role == 1 || currentId == userId ? (
                    <div className="user-feedback">
                        <Feedback 
                            userId={userId} 
                            feedback={feedbackState}
                        />
                    </div>
                ) : null }
                
                <ChangePointModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    type={type}
                    userId={userId}
                    data={userInfoState}
                    action={true}
                />
            </div>
        </>
    );
};

export default UserScreen;
