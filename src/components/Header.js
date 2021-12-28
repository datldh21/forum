import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import Url from "../util/url";
import logout from "../assets/icon/logout.svg";
import logo from "../assets/images/logo.svg";
import header from "../assets/images/header.svg";
import energy from "../assets/images/energy.svg";
import diamond from "../assets/images/diamond.svg";
import UserAvatar from "./user/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import tutorial1 from "../assets/images/tutorial1.png";
import tutorial2 from "../assets/images/tutorial2.png";
import { Modal, OverlayTrigger } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import split from "../assets/images/split-credit.svg";

const Header = (props) => {
    const history = useHistory();
    const page = props.page;
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentId = userInfo?._id;
    let myProfileState = useSelector((state) => state.headerInfo.user);
    const creditState = useSelector((state) => state.credit);
    const poolCredit = creditState && creditState?.poolCredit;
    const surplusPoolCredit = creditState && creditState?.surplusPoolCredit;

    useEffect(async () => {
        const resPoolCredit = await axios.get(Url("credit/get-pool-credit"));
        dispatch({ type: "SET_CREDIT", data: resPoolCredit.data[0] });
    }, []);

    const logOut = () => {
        window.localStorage.removeItem("userInfo");
        window.location.href = "/";

    };

    const clickHome = () => {
        history.push({ pathname: '/' });
        <Redirect to='/' />

    };

    const clickProfile = () => {
        history.push({ pathname: "profile" });

        <Redirect to="/profile" />;
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const reamainingCredit = surplusPoolCredit / poolCredit;
    return (
        <>
            {currentId == null || currentId == undefined ? null : (
                <div className="top-bar">
                    <div className="left">
                        <div className="logo">
                            <img
                                src={logo}
                                onClick={() => clickHome()}
                            />
                        </div>

                        <div className="credit">
                            <div className="nav-credit">
                                <div
                                    className="remaining-credit"
                                    style={{ width: `${reamainingCredit * 100}%` }}
                                >
                                <img className="logo-pool-credit" src={header} /></div>
                                <div className="split">
                                    <img className="split-1" src={split} />
                                    <img className="split-2" src={split} />
                                    <img className="split-3" src={split} />
                                    <img className="split-4" src={split} />
                                    <img className="split-5" src={split} />
                                    <img className="split-6" src={split} />
                                    <img className="split-7" src={split} />
                                    <img className="split-8" src={split} />
                                    <img className="split-9" src={split} />
                                </div>
                                <div className="surplus-total-pool-credit">{surplusPoolCredit}/{poolCredit}</div>
                            </div>
                        </div>
                    </div>

                    <div className="right">
                        <div className="point">
                            <img className="point-icon" src={energy} onClick={handleShow} />
                            <Modal size='lg' show={show} onHide={handleClose}>
                                <Carousel>
                                    <Carousel.Item>
                                        <img style={{width:'100%', height: '50%'}}
                                            src={tutorial1}
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img style={{width:'100%', height: '50%'}}
                                            src={tutorial2}
                                        />
                                    </Carousel.Item>
                                </Carousel>
                            </Modal>
                            <p className="my-point-now">{myProfileState?.point}</p>
                        </div>

                        <div className="my-credit">
                            <img className="diamond-icon" src={diamond} onClick={handleShow} />
                            <Modal size='lg' show={show} onHide={handleClose}>
                                <Carousel>
                                    <Carousel.Item>
                                        <img style={{width:'100%', height: '50%'}}
                                            src={tutorial1}
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img style={{width:'100%', height: '50%'}}
                                            src={tutorial2}
                                        />
                                    </Carousel.Item>
                                </Carousel>
                            </Modal>
                            <div className="credit-point">
                                <div className="my-credit-now">{Number(Math.ceil(myProfileState?.credit))}</div>
                                <div className="my-credit-use">
                                    <p>{Number(Math.ceil(myProfileState?.credit * 0.6))}</p>
                                </div>
                            </div>
                        </div>

                        <div className="user-area">
                            <div onClick={() => clickProfile()} className="bar-user avatar">
                                <UserAvatar
                                    avatar={myProfileState?.avatar}
                                />
                            </div>
                            <img className="icon-logout" onClick={logOut} src={logout} />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
export default Header;
