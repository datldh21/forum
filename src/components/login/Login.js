import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Redirect, useHistory } from 'react-router';
import Url from '../../util/url';
import "./login.scss";
import { useDispatch } from 'react-redux';

const Login = (props) => {
    const history = useHistory();
    const dispatch = useDispatch()
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userId = userInfo?._id;
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState(false);

    dispatch({ type: "SET_PAGE", data: null });

    const handleChangeEmail = e => {
        setEmail(e.target.value);
    }

    const handleChangePw = e => {
        setPassword(e.target.value);
    }

    const handleLogin = async e => {
        e.preventDefault();
        login(email, password)
    }
    const login = async (email, password) => {
        const user = {
            email: email,
            password: password
        };
        if (user) {
            try {
                const res = await axios.post(Url('user'), user);
                if (res.data.success) {
                    const data = res?.data?.response[0];
                    const dataInfo = {
                        _id: data._id,
                        role: data.role,
                    };
                    localStorage.setItem('userInfo', JSON.stringify(dataInfo));
                    history.push({ pathname: '/', state: data });
                    window.location.reload(true);

                } else {
                    setError(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <div className='login'>
            {userId === null || userId === undefined ?
                <div>
                    <div className='Title'>Login</div>
                    <Form onSubmit={handleLogin} style={{marginTop: "30px"}}>
                        <Form.Group className='mb-3' controlId='formBasicEmail'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' name='email' onChange={handleChangeEmail} />
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formBasicPassword' name='password' onChange={handleChangePw}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Password' />
                        </Form.Group>

                        {
                            error ? <p style={{ color: 'red' }} >Invalid Email address or Password</p> : null
                        }
                        <Button variant='primary' type='submit' style={{marginBottom: "15px"}}>
                            ????ng nh???p
                        </Button>
                    </Form>

                    <a href={"/signup"} style={{textAlign: "center"}}>Don't have account?</a>
                </div>
                :
                <Redirect to={{ pathname: '/' }} />
            }
        </div>
    );
}


export default Login;
