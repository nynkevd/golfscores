import React, {useContext} from 'react';

import {AuthContext} from "../../shared/auth-context";

const Signup = () => {

    const auth = useContext(AuthContext);

    const signupHandler = async (event) => {
        event.preventDefault();

        // VALIDATE INPUTS

        let body = JSON.stringify({
            name: document.getElementById("signup_name").value.toString(),
            username: document.getElementById("signup_username").value.toString(),
            password: document.getElementById("signup_password").value.toString()
        });

        console.log(body);

        await fetch(` ${process.env.REACT_APP_API_URL}/user/signup`, {
            method: 'POST',
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                auth.login(data.userId, data.token);
            });
    };

    return (
        <form onSubmit={signupHandler}>
            <label> Name </label>
            <input type="text" id="signup_name"/>
            <label> Username </label>
            <input type="text" id="signup_username"/>
            <label> Password </label>
            <input type="text" id="signup_password"/>
            <label> Password </label>
            <input type="text" id="signup_repeat"/>

            <button type="submit"> SIGNUP</button>

            {auth.isLoggedIn ? <p> Logged in </p> : <p> Not logged in </p>}

        </form>
    )
};

export default Signup;