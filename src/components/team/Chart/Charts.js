import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import UserAvatar from '../../user/UserAvatar';
import './styles.scss';

const Charts = ({}) => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const currentId = userInfo._id;
    const history = useHistory();
    const userState = useSelector((state) => state.user);

    const userStateSort = userState?.sort((a, b) => b?.point - a?.point);
    const handClick = (_id) => {
        history.push({ pathname: `/user/${_id}` });
    }

    const nth = (n) => {
        return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
    }

    const RankUser = ({ item, index, className }) => {
        return (
            <div>
                <div className={`charts-item  rank-${index + 1} ${className ? className : ''}`}>
                    <div className='user-chart'>
                        <div className={`user-rank`}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p>
                                    {index + 1}
                                    {nth(index + 1)}
                                </p>{' '}
                                <p className='start'> *</p>
                            </div>
                        </div>
                        <UserAvatar avatar={item.avatar} teams={item.teams} />
                        <div
                            className='user-name'
                            onClick={() => {
                                handClick(item?._id);
                            }}
                        >
                            {item?.firstName} {item?.lastName}
                        </div>
                        <div className='user-point'>
                            <p>{item?.point ? item?.point : 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className='charts-total'>
            {userStateSort &&
                userStateSort.map((item, index) => {
                    if (item._id == currentId) {
                        return <RankUser item={item} index={index} className='active-user' />;
                    } else {
                        return <RankUser item={item} index={index} />;
                    }
                })}
        </div>
    );
};

export default Charts;
