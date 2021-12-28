import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddItem from './AddItem';
import ListItemExchange from './ListItemExchange';
import ListItems from './ListItems';
import MyItem from './MyItems';

const Items = (props) => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const currentId = userInfo._id;
    const role = userInfo.role;
    const [showItem, setShowItem] = useState(false);

    const handleAdd = () => {
        setShowItem(true);
    };
    return (
        <>
            <div className='add-item'>
                {role == 1 ? <Button onClick={handleAdd}>Thêm item</Button> : null}
            </div>
            <div className='items-page container'>
                {role == 1 ? (
                    <>
                        {' '}
                        <div className='items-page left'>
                            <ListItemExchange />
                        </div>
                        <div className='items-page right'>
                            <ListItems />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='items-page left'>
                            <ListItems />
                        </div>
                        <div className='items-page right'>
                            <MyItem id={currentId} />
                        </div>
                    </>
                )}
                <AddItem show={showItem} onHide={() => setShowItem(false)} />
            </div>
        </>
    );
};

export default Items;
