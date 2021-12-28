import axios from 'axios';
import { useState } from 'react';
import { Modal, Button, Form, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Url from '../../util/url';

const ChangeInfoModal = (props) => {
    const type = props?.type;
    const userId = props?.userId;
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeFirstName = async (e) => {
        const value = e.target.value;
        setFirstName(value);
    }

    const handleChangeLastName = async (e) => {
        const value = e.target.value;
        setLastName(value);
    }

    const handleChangeAvatar = async (e) => {
        const value = e.target.value;
        setAvatar(value);
    }

    const updateName = async (e) => {
        e.preventDefault();
        if (!firstName == null || !lastName == null) {
            setError(true);
        } else {
            setIsLoading(true);
            const res = await axios.patch(Url(`user/info/${userId}`), {firstName, lastName});
            setIsLoading(false);
            dispatch({
                type: 'UPDATE_NAME',
                data: { firstName, lastName }
            });
            dispatch({
                type: 'UPDATE_HEADER_NAME',
                data: { firstName, lastName }
            })
            props.onHide();
            setFirstName('');
            setLastName('');
        }
    }

    const updateAvatar = async (e) => {
        e.preventDefault();
        if (!avatar) {
            setError(true);
        } else {
            setIsLoading(true);
            const res = await axios.patch(Url(`user/info/${userId}`), {avatar});
            setIsLoading(false);
            dispatch({
                type: 'UPDATE_AVATAR',
                data: { avatar: String(avatar) }
            });
            dispatch({
                type: 'UPDATE_HEADER_AVATAR',
                data: { avatar: String(avatar) }
            })
            props?.onHide();
            setAvatar('');
        }
    }

    return (
        <>
            <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header style={{ justifyContent: 'flex-end' }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <Button
                                className='close'
                                aria-label='Close'
                                onClick={() => {
                                    props.onHide();
                                }}
                            >
                                {' '}
                                <span aria-hidden='true'>&times;</span>
                            </Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {type == true ? (
                            <div className='change-action name'>
                                <Form.Label>Sửa Tên:</Form.Label>
                                <div className='first-name'>
                                    <FormControl
                                        placeholder='First Name'
                                        type='string'
                                        name='firstName'
                                        onChange={handleChangeFirstName}
                                    />
                                </div>
                                <br></br>
                                <div className='last-name'>
                                    <FormControl
                                        placeholder='Last Name'
                                        type='string'
                                        name='lastName'
                                        onChange={handleChangeLastName}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className='change-action avatar'>
                                <Form.Label>Sửa Avatar:</Form.Label>
                                <FormControl 
                                    placeholder='url avatar mới'
                                    name='avatar'
                                    onChange={handleChangeAvatar}
                                />
                            </div>
                        ) }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {type == true ? (
                        <Button type='submit' onClick={updateName}>
                            Cập nhật
                        </Button>
                        ) : (
                        <Button type='submit' onClick={updateAvatar}>
                            Cập nhật
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangeInfoModal;