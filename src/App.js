import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";

import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import {AuthContext} from "./shared/auth-context";
import {useAuth} from "./shared/auth-hook";

const App = () => {

    const {token, userId, login, logout} = useAuth();

    let routes;
    if (token) {
        routes = (
            <Switch>
                <Route exact path="/login"> <Login/> </Route>
                <Route exact path="/signup"> <Signup/> </Route>
                <Redirect to="/"/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/login"> <Login/> </Route>
                <Route exact path="/signup"> <Signup/> </Route>
                <Redirect to="/"/>
            </Switch>
        );
    }

    return (

        <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}>
            <Router>
                <main>
                    <p> Hallo </p>
                    {routes}
                </main>
            </Router>
        </AuthContext.Provider>

    );

};

export default App;
