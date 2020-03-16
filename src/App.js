import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";

import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import {AuthContext} from "./shared/auth-context";
import {useAuth} from "./shared/auth-hook";
import Dashboard from "./general/pages/Dashboard";
import UserInfo from "./user/pages/UserInfo";
import CreateGroup from "./groups/pages/CreateGroup";

const App = () => {

    const {token, userId, login, logout} = useAuth();

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route exact path="/"> <Dashboard/> </Route>
                <Route exact path="/userinfo"> <UserInfo/> </Route>
                <Route exact path="/creategroup"> <CreateGroup/> </Route>
                {/*<Redirect to="/"/>*/}
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/login"> <Login/> </Route>
                <Route exact path="/signup"> <Signup/> </Route>
                {/*<Redirect to="/login"/>*/}
            </Switch>
        );
    }

    return (

        <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}>
            <Router>
                <main>
                    {routes}
                </main>
            </Router>
        </AuthContext.Provider>

    );

};

export default App;
