import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import './styles.scss';
import axios from 'axios';
import Url from '../../util/url';
import DateTimeUtils from '../../util/datetime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faCheckCircle, faLaptopHouse, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

const WorkingCalendar = ({}) => {
    const [myStartWorkingHours, setMyStartWorkingHours] = useState([]);
    const [myWFHs, setMyWFHs] = useState([]);
    const [myDayoffs, setMyDayoffs] = useState([]);
    const [otherWFHs, setOtherWFHs] = useState([]);
    const [otherDayoffs, setOtherDayoffs] = useState([]);
    const user = useSelector((state) => state.headerInfo.user);

    useEffect(() => {
        const getMyWorkingTime = async() => {
            const res = await axios.get(Url('get-working-time?id=' + user._id));
            res.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setMyStartWorkingHours(res.data.map(item => ({...item, date: new Date(item.date)})));
        }

        getMyWorkingTime();
    }, []);

    useEffect(() => {
        const fetchAllWFHRequests = async() => {
            const res = await axios.get(Url('wfhs'));
            const data = res.data.map(request => ({...request, date: new Date(request.date)}));
            setMyWFHs(data.filter(request => request.userId === user._id));
            setOtherWFHs(data.filter(request => request.userId !== user._id));
        }

        const fetchAllDayoffRequests = async() => {
            const res = await axios.get(Url('dayoffs'));
            const data = res.data.map(request => ({...request, date: new Date(request.date)}));
            setMyDayoffs(data.filter(request => request.userId === user._id));
            setOtherDayoffs(data.filter(request => request.userId !== user._id));
        }

        fetchAllWFHRequests();
        fetchAllDayoffRequests();
    }, []);

    const setTileContent = ({ activeStartDate, date, view }) => {
        const myWorkingHour = myStartWorkingHours.find(item => DateTimeUtils.areSameDate(item.date, date));
        const myApprovedWFHRequest = myWFHs.find(request => DateTimeUtils.areSameDate(request.date, date) && request.approved === true);
        const myApprovedDayoffRequest = myDayoffs.find(request => DateTimeUtils.areSameDate(request.date, date) && request.approved === true);
        const otherApprovedWFHRequests = otherWFHs.filter(request => DateTimeUtils.areSameDate(request.date, date) && request.approved === true);
        const otherApprovedDayoffRequests = otherDayoffs.filter(request => DateTimeUtils.areSameDate(request.date, date) && request.approved === true);
        const uniqueOtherAvatars = otherApprovedWFHRequests.concat(otherApprovedDayoffRequests)
                                    .reduce((uniqueAvatars, request) => {
                                        if (uniqueAvatars.indexOf(request.user.avatar) === -1) {
                                            return uniqueAvatars.concat(request.user.avatar);
                                        }
                                        return uniqueAvatars;
                                    }, []);
        if (view === 'month') {
            return (
                <>
                    {myApprovedWFHRequest && (
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} className="approved-icon" />
                            <FontAwesomeIcon icon={faLaptopHouse} className="wfh-icon" />
                        </>
                    )}
                    {myApprovedDayoffRequest && (
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} className="approved-icon" />
                            <FontAwesomeIcon icon={faPhoneSlash} className="dayoff-icon" />
                        </>
                    )}
                    <div className="tile-footer">
                        <div className="checkin">
                            {myWorkingHour !== undefined && (
                                <span className={parseInt(myWorkingHour.checkin.substr(0, 2)) >= 9 && parseInt(myWorkingHour.checkin.substr(3, 2)) > 0 ? 'late' : ''}>
                                    {myWorkingHour.checkin !== '' && (
                                        <FontAwesomeIcon icon={faSignInAlt} />
                                    )}
                                    {myWorkingHour.checkin}
                                </span>
                            )}
                        </div>
                        <div className="other-requests">
                            <div className="avatars">
                                {uniqueOtherAvatars.length > 0 && (
                                    <img src={uniqueOtherAvatars[0]} />
                                )}
                                {uniqueOtherAvatars.length > 1 && (
                                    <div>+{uniqueOtherAvatars.length - 1}</div>
                                )}
                            </div>
                            <div className="details">
                                {otherApprovedWFHRequests.map((request, index) => (
                                    <div key={index} class="request wfh">
                                        <div>
                                            <img src={request.user.avatar} />
                                            <span>{request.user.firstName} {request.user.lastName}</span>
                                        </div>
                                        <div className={request.slot}>
                                            <FontAwesomeIcon icon={faLaptopHouse} className="wfh-icon" />
                                        </div>
                                    </div>
                                ))}
                                {otherApprovedDayoffRequests.map((request, index) => (
                                    <div key={index} class="request dayoff">
                                        <div>
                                            <img src={request.user.avatar} />
                                            <span>{request.user.firstName} {request.user.lastName}</span>
                                        </div>
                                        <div className={request.slot}>
                                            <FontAwesomeIcon icon={faPhoneSlash} className="dayoff-icon" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        return null;
    }

    const setTileClassName = date => {
        const foundWFHRequest = myWFHs.find(request => DateTimeUtils.areSameDate(request.date, date.date) && request.approved === true);
        const foundDayoffRequest = myDayoffs.find(request => DateTimeUtils.areSameDate(request.date, date.date) && request.approved === true);
        if (foundWFHRequest) {
            return foundWFHRequest.slot + (foundWFHRequest.approved !== undefined ? (foundWFHRequest.approved ? ' approved' : ' declined') : '');
        } else if (foundDayoffRequest) {
            return foundDayoffRequest.slot + (foundDayoffRequest.approved !== undefined ? (foundDayoffRequest.approved ? ' approved' : ' declined') : '');
        }

        return '';
    }

    return (
        <div className="checkin-monitor container">
            <div className="my-calendar">
                <div className="my-calendar-header">
                    <h2>Giờ làm việc của tôi & team</h2>
                    {myStartWorkingHours.length > 0 && (
                        <div className="last-update">
                            Last update: {' '}
                            {myStartWorkingHours[myStartWorkingHours.length - 1].date.getDate() + '/' + (myStartWorkingHours[myStartWorkingHours.length - 1].date.getMonth() + 1) + '/' + myStartWorkingHours[myStartWorkingHours.length - 1].date.getFullYear()}
                        </div>
                    )}
                </div>
                <Calendar tileContent={setTileContent} tileClassName={setTileClassName} />
                <div className="indices">
                    <div>
                        <div className="indice wfh">
                            <FontAwesomeIcon icon={faLaptopHouse} className="wfh-icon" />wfh
                        </div>
                        <div className="indice dayoff">
                            <FontAwesomeIcon icon={faPhoneSlash} className="dayoff-icon" />nghỉ phép
                        </div>
                    </div>
                    <div>
                        <div className="indice morning">
                            <span></span>buổi sáng
                        </div>
                        <div className="indice afternoon">
                            <span></span>buổi chiều
                        </div>
                        <div className="indice allday">
                            <span></span>cả ngày
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkingCalendar;