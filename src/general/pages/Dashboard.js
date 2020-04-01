import React, {useContext, useEffect, useState} from 'react';

import {AuthContext} from "../../shared/auth-context";
import {Link} from "react-router-dom";
import axios from "axios";

const Dashboard = () => {

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState();


    useEffect(() => {
        console.log(auth.token);
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/user/dashboard`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                console.log(res.data);
            })
        })();
        setIsLoading(false);
    }, []);


    const logoutHandler = () => {
        auth.logout();
    };

    return (
        <React.Fragment>

            <br/> <br/>

            <Link to="/userinfo">
                <button> EDIT USER</button>
            </Link>

            <Link to="/creategroup">
                <button> CREATE GROUP</button>
            </Link>

            <button onClick={logoutHandler}> LOGOUT</button>

        </React.Fragment>
    )
};

export default Dashboard;