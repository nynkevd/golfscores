import React, {useContext} from 'react';

import {AuthContext} from "../../shared/auth-context";
import {Link} from "react-router-dom";

const Dashboard = () => {

    const auth = useContext(AuthContext);

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