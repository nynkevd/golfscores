import React, {useContext} from 'react';
import {AuthContext} from "../../shared/auth-context";

const Login = () => {
    const auth = useContext(AuthContext);

    const loginHandler = async (event) => {
        event.preventDefault();

        // VALIDATE INPUTS

        let body = JSON.stringify({
            username: document.getElementById("login_username").value.toString(),
            password: document.getElementById("login_password").value.toString()
        });

        console.log(body);

        await fetch(` ${process.env.REACT_APP_API_URL}/user/login`, {
            method: 'POST',
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                auth.login(data.userId, data.token);
            });
    };

    return (
        <React.Fragment>
            <h2> Login </h2>
            <form onSubmit={loginHandler}>
                <label> Username </label>
                <input type="text" id="login_username"/>
                <label> Password </label>
                <input type="text" id="login_password"/>

                <button type="submit"> LOGIN</button>

                {auth.isLoggedIn ? <p> Logged in </p> : <p> Not logged in </p>}

            </form>
        </React.Fragment>
    )
};

export default Login;