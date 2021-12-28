import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Url from '../../util/url';
import InfoUser from './TemplateInfoUser';
import { useDispatch, useSelector } from 'react-redux';
import LeaderBoard from '../home/LeaderBoard';
import NavBar from '../Navbar';
import ribbon from '../../assets/images/ribbon_leaderboard.png';


const Profile = (props) => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const currentId = userInfo._id;
    const role = userInfo.role;
    const [dt, setData] = useState([]);
    const [leaderboard, setLeaderBoard] = useState('total');
    const [page, setPage] = useState('');
    const dispatch = useDispatch();
    const chartTotal = useSelector((state) => state.user);

    useEffect(() => {
        dispatch({ type: 'SET_PAGE', data: page });
    });
    
    const leaderBoardByTotal = async () => {
        const resTotal = await axios.get(Url('point/rankings'));    
        dispatch({
            type: 'GET_ALL_USER',
            data: resTotal?.data?.response && resTotal?.data?.response.filter((user) => user.role !== 1)
        });
    }

    useEffect(async () => {
        try {
            leaderBoardByTotal();
            dispatch({ type: 'SET_BONUS_BY_USER', data: null });
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(async () => {
        try {
            const res = await axios.get(Url('user/info/') + currentId);
            const dataMap = res?.data?.response?.map((item) => {
                return {
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    gender: item.gender,
                    position: item.position,
                    startDate: item.startDate,
                    role: item.role,
                    point: item.point,
                    avatar: item.avatar,
                    teams: item.teams
                };
            });
            setData(dataMap);
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <>    
            <div className='container profile-screen'>
                <div className='box'>
                    <div className='wrap-leaderboard'>
                        <div className='ribbon'>
                            <img src={ribbon} />
                            <p className='title'>BXH Tháng 10</p>
                        </div>
                        <div className='leaderboard'>
                            {leaderboard == 'total' ? (
                                <div className='view-leaderboard'>
                                    <LeaderBoard chart={chartTotal} />
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className='right'>
                        <div className='navbar-position'>
                            <NavBar page={page} />
                        </div>
                        <div className='info-user'>
                            <InfoUser currentId={currentId} userId={currentId} role={role} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;