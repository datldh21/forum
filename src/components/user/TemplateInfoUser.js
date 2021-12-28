import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Url from "../../util/url";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import energy from "../../assets/images/thunder_leaderboard.png";
import diamond from "../../assets/images/Rectangle.svg";
import editIcon from "../../assets/images/Edit.svg";
import ChangeInfoModal from "../home/ChangeInfoModal";
import split from "../../assets/images/Split-shop.png";
import comingSoon from "../../assets/images/coming-soon.png";
import totalPointIcon from "../../assets/images/totalPoint.svg";
import totalCreditIcon from "../../assets/images/totalCredit.svg";
import tongQua from "../../assets/images/TongQua.svg";
import top1tuan from "../../assets/images/Top1tuan.svg";
import top3tuan from "../../assets/images/Top3tuan.svg";
import nhanThuong from "../../assets/images/NhanThuong.svg";

const InfoUser = (props) => {
    const id = props?.userId;
    const currentId = props.currentId;
    const [modalShow, setModalShow] = useState(false);
    const [type, setType] = useState(false);
    const dispatch = useDispatch();
    let myProfileState = useSelector((state) => state.myProfile.userInfo);

    useEffect(async () => {
        const res = await axios.get(Url("user/info/" + currentId));
        res.data.success && dispatch({ type: "SET_USER_INFO", data: res.data.response[0] });
    }, []);

    const handleClick = (show, type) => {
        setModalShow(show);
        setType(type);
    };
    const daysInMonth = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        return new Date(year, month, 0).getDate();
    };

    function monthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    const nDays = daysInMonth();
    const today = new Date().getDate();
    const currentLevel = monthDiff(new Date(myProfileState?.startDate), new Date());
    const nextLevel = currentLevel + 1;
    const levelByDay = today / nDays;
    return (
        <div>
            {myProfileState && (
                <div className="user-template">
                    <div className="user-item">
                        <div className="user-item-avatar">
                            <UserAvatar avatar={myProfileState.avatar} />
                        </div>
                        {/* <img className='edit-avatar' src={editIcon} onClick={() => handleClick(true, false)} /> */}

                        <div className="user-item-info">
                            <div className="username">
                                {myProfileState.firstName + " " + myProfileState.lastName}
                                <img
                                    className="edit-name"
                                    src={editIcon}
                                    onClick={() => handleClick(true, true)}
                                />
                            </div>
                            <div className="position">{myProfileState.position}</div>
                        </div>

                        <ChangeInfoModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            type={type}
                            userId={currentId}
                        />
                    </div>

                    <img className="split" src={split} />

                    <div className="user-level">
                        <div className="level current-level">
                            <p className='text-lv'>Lv</p> 
                            <p className='lv'>{currentLevel}</p>
                        </div>
                        <div className="level-in-month">
                            <div
                                className="level-by-date"
                                style={{ width: `${levelByDay * 100}%` }}
                            ></div>
                        </div>
                        <div className="level next-level">
                            <p className='text-lv'>Lv</p> 
                            <p className='lv'>{nextLevel}</p>
                        </div>
                    </div>

                    <div className="coming-soon">
                        <img src={comingSoon} />
                    </div>

                    <div className="user-point-info">
                        <div className="line-1">
                            <div className="bonus-history-icon">
                                <img src={nhanThuong} />
                            </div>
                            <div className='bonus-history'>
                                <div className='text'><p>Nhận thưởng</p></div>
                                <div className='data-bonus-history'>Updating...</div>
                            </div>
                            <div className="top3-icon">
                                <img src={top3tuan} />
                            </div>
                            <div className='top3'>
                                <div className='text'><p>Top 3 tuần</p></div>
                                <div className='data-top3'>Updating...</div>
                            </div>
                            <div className='top1-icon'>
                                <img src={top1tuan} />
                            </div>
                            <div className='top1'>
                                <div className='text'><p>Top 1 tuần</p></div>
                                <div className='data-top1'>Updating...</div>
                            </div>
                        </div>

                        <div className="line-2">
                            <div className="present-icon">
                                <img src={tongQua} />
                            </div>
                            <div className='present'>
                                <div className='text'><p>Tổng quà</p></div>
                                <div className='data-present'>Updating...</div>
                            </div>
                            <div className="point-icon">
                                <img src={totalPointIcon} />
                            </div>
                            <div className="point">
                                <div className="text">
                                    <p>Tổng</p>
                                </div>
                                <div className="images">
                                    <img src={energy} />
                                </div>
                                <div className="data-point">{myProfileState.point}</div>
                            </div>
                            <div className="credit-icon">
                                <img src={totalCreditIcon} />
                            </div>
                            <div className="credit">
                                <div className="text">
                                    <p>Tổng</p>
                                </div>
                                <div className="images">
                                    <img src={diamond} />
                                </div>
                                <div className="data-credit">{myProfileState.credit}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoUser;
