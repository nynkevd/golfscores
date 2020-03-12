import React, {useContext, useState} from 'react';
import {AuthContext} from "../../shared/auth-context";
import {BrowserRouter as Redirect} from "react-router-dom";
import {isMinLength, checkFormValid} from "../../shared/validators";

import SideGolf from './../../assets/sidegolf.jpg';
import './LoginSignup.css';

const Login = () => {
    const auth = useContext(AuthContext);
    const [formState, setFormState] = useState({
        username: {
            value: '',
            valid: false
        },
        password: {
            value: '',
            valid: false
        }
    });
    const [error, setError] = useState();

    console.log(auth.isLoggedIn);

    const loginHandler = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);

        if (formValid) {
            await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username: formState.username.value,
                    password: formState.password.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    auth.login(data.userId, data.token);
                    return <Redirect to="/signup"/>
                })
                .catch(() => {
                    setError("Deze gebruiker kan niet worden ingelogd, probeer opnieuw.");
                });
        } else {
            setError("Gegevens kloppen niet.");
        }
    };

    const checkLength = (event) => {
        setError(null);
        if (event.target.name in formState) {
            setFormState({
                ...formState,
                [event.target.name]: {
                    value: event.target.value,
                    valid: isMinLength(event.target.value, event.target.minLength)
                }
            });
        }
    };

    return (
        <React.Fragment>
            <div className="ls-page">
                <div className="ls-image">
                    <img src={SideGolf} alt="Afbeelding van een grasveld"/>
                </div>

                <div className="ls-form-wrapper">
                    <div className="ls-form">
                        <h2> Login </h2>
                        <form onSubmit={loginHandler} autoComplete="off">
                            <label> gebruikersnaam </label>
                            <input autoCorrect="off" autoCapitalize="none" name="username" onChange={checkLength}
                                   minLength="5" type="text"/>
                            <label> wachtwoord </label>
                            <input autoCorrect="off" autoCapitalize="none" name="password" onChange={checkLength}
                                   minLength="6" type="current-password"/>

                            <br/>

                            {error ? <p className="error ls-footer"> {error} </p> : ""}

                            <button type="submit"> LOGIN</button>
                        </form>

                        <p className="ls-footer"> nog geen account? <a href="signup"> aanmelden </a></p>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
};

export default Login;