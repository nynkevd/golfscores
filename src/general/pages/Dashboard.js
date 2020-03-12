import React, {useContext} from 'react';

import {AuthContext} from "../../shared/auth-context";

const Dashboard = () => {

    const auth = useContext(AuthContext);

    const logoutHandler = () => {
        auth.logout();
    };

    return (
        <React.Fragment>

            <br/> <br/>

            <button onClick={logoutHandler}> LOGOUT</button>

        </React.Fragment>
    )
};

export default Dashboard;