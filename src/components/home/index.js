import { useEffect, useState } from 'react';
import Url from '../../util/url';
import { useDispatch, useSelector } from 'react-redux';
import LeaderBoard from '../home/LeaderBoard';
import axios from 'axios';
import ribbon from '../../assets/images/ribbon_leaderboard.png';
import NavBar from '../Navbar';
import Button from 'react-bootstrap/Button';
import 'react-calendar/dist/Calendar.css';
import OutOfficeRegistration from '../outoffice-registration';
import Feedback from '../feedback';
import moment from 'moment';
import ListItems from '../item/ListItems';
import HistoryPointTable from './HistoryPointTable';
import RequestShoppingModal from './RequestShopping/RequestShoppingModal';
import MyItem from '../item/MyItems';
import './home.scss';
import { Redirect, useHistory } from "react-router";
import split from "../../assets/images/Split-shop.png";
import WorkingCalendar from '../working-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopHouse, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
import UpdateWorkingTimeModal from '../update-working-time';
import Request from '../request';

const Home = (props) => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentId = userInfo._id;
    const role = userInfo.role;
    const history = useHistory();
    const [leaderboard, setLeaderBoard] = useState('total');
    const [errorNoData, setErrorNoData] = useState(false);
    const [items, setItems] = useState('');
    const [allItems, setAllItems] = useState('');
    const [registrationDialogVisible, setRegistrationDialogVisible] = useState(false);
    const [registrationDialogType, setRegistrationDialogType] = useState();
    const [requestShoppingVisible, setRequestShoppingVisible] = useState(false);
    const [updateWorkingTimeModalVisible, setUpdateWorkingTimeModalVisible] = useState(false);
    const dispatch = useDispatch();
    const chartTotal = useSelector((state) => state.user);
    const feedbackState = useSelector((state) => state.feedback);
    const pageState = useSelector((state) => state.page);
    const bonusState = useSelector((state) => state.notifications?.data);
    const requestState = useSelector((state) => state.request?.data);

    useEffect(async () => {
        try {
            leaderBoardByTotal();
            getHistoryBonus();
            const request = await getListRequest();
            const allRequest = await getAllRequest();
            setItems(request);
            setAllItems(allRequest);
            dispatch({
                type: 'SET_BONUS_BY_USER',
                data: null
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const leaderBoardByTotal = async () => {
        const resTotal = await axios.get(Url('point/rankings'));
        dispatch({
            type: 'GET_ALL_USER',
            data: resTotal?.data?.response && resTotal?.data?.response.filter((user) => user.role !== 1)
        });
    }

    const getHistoryBonus = async () => {
        const res = await axios.get(Url("point/user/") + currentId);
        const data = res?.data;
        const response = data?.response;
        if (data?.success) {
            const dataMap = response?.map((item, index) => {
                return {
                    id: item._id,
                    date: moment(item.edit_date).format("DD/MM"),
                    point: item.point,
                    reason: item.reason,
                    name: item.firstName + " " + item.lastName,
                    position: item.position,
                    role: item.role,
                    avatar: item.avatar,
                    hide: item.hide,
                    seen: item.seen,
                    userId: item.userId,
                };
            });
            dispatch({ type: "SET_DATA_NOTIFICATION", data: dataMap && dataMap });
            return dataMap;
        } else {
            setErrorNoData(true);
        }
    };

    const getListRequest = async () => {
        let url = Url('request/' + currentId);
        const res = await axios.get(url);
        if (res.data.success) {
            const dataResquest = res.data?.response.map((item, index) => {
                return {
                    id: item._id,
                    userId: item.userId,
                    username: item.firstName + ' ' + item.lastName,
                    avatar: item.avatar,
                    item: item.item,
                    status: item.status,
                    description: item.description,
                    price: item.price,
                    date: moment(item.date).format('ll')
                };
            });
            dispatch({ type: 'SET_MY_ITEM', data: dataResquest });
            return dataResquest;
        }
    };

    const getAllRequest = async () => {
        let url = Url('request');
        const res = await axios.get(url);
        if (res.data.success) {
            const dataResquest = res.data?.response.map((item, index) => {
                return {
                    id: item._id,
                    userId: item.userId,
                    name: item.firstName + ' ' + item.lastName,
                    imgItem: item.item[0].item,
                    status: item.status,
                    description: item.item[0].description,
                    avatar: item.avatar,
                    date: moment(item.date).format('DD/MM'),
                    price: item.item[0].price,
                    seen: item.seen
                };
            });
            dispatch({ type: 'SET_REQUEST', data: dataResquest && dataResquest });
            return dataResquest;
        } else {
            setErrorNoData(true);
        }
    };

    useEffect(async () => {
        const res = await axios.get(Url(("comment/get-comment/") + currentId));
        res.data.success && dispatch({ type: "SET_USER_FEEDBACK", data: res.data.response });
    }, []);

    useEffect(async () => {
        const res = await axios.get(Url('item'));
        if (res.data?.success) {
            const data = res.data?.response.map((item, index) => {
                return {
                    id: item._id,
                    index: index + 1,
                    item: item.item,
                    description: item.description,
                    price: item.price,
                };
            });
            dispatch({ type: 'SET_ITEM', data });
        } else {
            setErrorNoData(true);
        }
    }, []);

    const showOutOfficeRegistrationDialog = type => {
        setRegistrationDialogType(type);
        setRegistrationDialogVisible(true);
    }

    return (
        <>
            {pageState && (
                <div className='container home'>
                    <div className='box'>
                        <div className='wrap-leaderboard'>
                            <div className='ribbon'>
                                <img src={ribbon} />
                                <p className='title'>Tháng 12</p>
                            </div>
                            <div className='leaderboard'>
                                {leaderboard == 'total' ? (
                                    <div className='view-leaderboard'>
                                        <LeaderBoard chart={chartTotal} />
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className='right outoffice-registration-container'>
                            <div className='navbar-position'>
                                <NavBar page={pageState} />
                            </div>
                            <div className='body'>
                                { pageState == 'Home' || pageState == 'Dashboard' ? (
                                    <div className='dashboard'>
                                        {feedbackState && role != 1 ? (
                                            <div className="feedback">
                                                <Feedback
                                                    userId={currentId}
                                                    feedback={feedbackState}
                                                />
                                            </div>
                                        ) : null }

                                        <div className="outoffice-registration">
                                            <div className="services">
                                                <Button variant='primary' onClick={() => showOutOfficeRegistrationDialog('wfhs')}>
                                                    <FontAwesomeIcon icon={faLaptopHouse} />
                                                    Đăng kí làm Online
                                                </Button>
                                                <Button variant='danger' onClick={() => showOutOfficeRegistrationDialog('dayoffs')}>
                                                    <FontAwesomeIcon icon={faPhoneSlash} />
                                                    Đăng kí nghỉ phép
                                                </Button>
                                                {role === 1 && (
                                                    <Button className="working-time-manager-btn" variant='secondary' onClick={() => setUpdateWorkingTimeModalVisible(true)}>
                                                        Nhập dữ liệu máy chấm công
                                                    </Button>
                                                )}
                                                <Button className="request-shopping-btn" variant='primary' onClick={() => setRequestShoppingVisible(true)}>
                                                    Yêu cầu mua sắm
                                                </Button>
                                                <Button onClick={() => {
                                                    history.push({ pathname: '/active-sprint' });
                                                    <Redirect to='/active-sprint' />
                                                }} style={{background: "#8536CD"}}>
                                                    Active Sprint
                                                </Button>
                                            </div>

                                            {registrationDialogVisible && registrationDialogType && (
                                                <OutOfficeRegistration type={registrationDialogType} hideDialog={() => setRegistrationDialogVisible(false)} />
                                            )}

                                            <RequestShoppingModal
                                                show={requestShoppingVisible}
                                                onHide={() => setRequestShoppingVisible(false)}
                                            />
                                        </div>

                                        <WorkingCalendar />
                                    </div>
                                ) : null }

                                {pageState == 'Shop' ? (
                                    <div>
                                        <div className='list-item-exchange'>
                                            <ListItems />
                                        </div>
                                        <img className="split" src={split} />
                                        <p className="text">Item đã đổi</p>
                                        <div className='my-exchanged-item'>
                                            <MyItem id={currentId} />
                                        </div>
                                    </div>
                                ) : null }

                                {pageState == 'Notifications' ? (
                                    <div className="notifications">
                                        <HistoryPointTable
                                            bonus={bonusState}
                                            role={role}
                                            actionShow={true}
                                        />
                                        {requestState && (
                                            <Request
                                                request={requestState}
                                            />
                                        )}
                                    </div>
                                ) : null }
                            </div>
                        </div>
                    </div>

                    {updateWorkingTimeModalVisible && (
                        <UpdateWorkingTimeModal hideModal={() => setUpdateWorkingTimeModalVisible(false)} />
                    )}
                </div>
            )}
        </>
    )
}

export default Home;