import { useSelector } from 'react-redux';
import Error from '../Error';

const MyItem = (props) => {
    const myItemState = useSelector((state) => state.myitem);

    return (
        <div>
                <div className='my-item-template'>
                    <div className='my-item-content'>
                        {myItemState.length == 0 ? (
                            <Error />
                        ) : (
                            myItemState.map((item, index) => {
                                return (
                                    <div className='card-my-item'>
                                        <div className='card-description'>
                                            <img src={item.item}></img>
                                            <div className='date'>
                                                <p>{item.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
        </div>
    );
};
export default MyItem;
