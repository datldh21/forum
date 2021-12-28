import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import UserAvatar from '../user/UserAvatar';
import thunder from '../../assets/images/thunder_leaderboard.png';
import medal1st from '../../assets/images/Medal1st.png';
import medal2nd from '../../assets/images/Medal2nd.png';
import medal3rd from '../../assets/images/Medal3rd.png';

const LeaderBoard = ({}) => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const currentId = userInfo._id;
    const history = useHistory();
    const userState = useSelector((state) => state.user);
    const userStateSort = userState?.sort((a, b) => b?.point - a?.point);
    const handClick = (_id) => {
        history.push({ pathname: `/user/${_id}` });
    };
    
    const RankUser = ({ item, index, className }) => {
        return (
            <>  
                <div className={`leaderboard-item rank-${index + 1} ${className ? className : ''}`}>
                    <div className='user-leaderboard'>
                        <div className='wrap-user-rank'>
                            <div className='user-rank'>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {(index + 1 == 1) && (
                                        <img src={medal1st} />
                                    )}
                                    {(index + 1 == 2) && (
                                        <img src={medal2nd} />
                                    )}
                                    {(index + 1 == 3) && (
                                        <img src={medal3rd} />
                                    )}
                                    {(index + 1 > 3) && (
                                        <p>
                                            {index + 1}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <UserAvatar avatar={item.avatar} />
                        <div
                            className='user-name'
                            onClick={() => {
                                handClick(item?._id);
                            }}
                        >
                            {item?.firstName} {item?.lastName}
                        </div>

                        <div className='user-thunder-icon'>
                            <img src={thunder} />
                        </div>
                        <div className='user-point'>
                            <p>{item?.point ? item?.point : 0}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    };
    return (
        <>
            <div className='leaderboard-total'>
                {userStateSort &&
                    userStateSort.map((item, index) => {
                        if (item._id == currentId) {
                            return <RankUser item={item} index={index} className='active-user' />;
                        } else {
                            return <RankUser item={item} index={index} className='other-user' />;
                        }
                    })}
            </div>
        </>
    );
};

export default LeaderBoard;
