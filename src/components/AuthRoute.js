import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import Url from "../util/url";

const AuthRoute = ({ component: Component, ...rest }) => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userID = userInfo?._id;
    rest.changePage();
    const dispatch = useDispatch();
    const [fetchInfoDone, setFetchInfoDone] = useState(false);


    useEffect(() => {
        const fetchUserInfo = async() => {
            const res = await axios.get(Url("user/info/" + userID));
            res.data.success && dispatch({ type: "SET_HEADER_INFO", data: res.data.response[0] });
            setFetchInfoDone(true);
        }

        fetchUserInfo();
    }, []);

    return (
        <Route
            {...rest}
            render={(props) =>
                userID ? (
                    fetchInfoDone && (
                        <Component {...props} />
                    )
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    );
};

export default AuthRoute;
