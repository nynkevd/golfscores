import React, {useContext, useState} from 'react';
import {AuthContext} from "../../shared/auth-context";
import {isMinLength, checkFormValid} from "../../shared/validators";

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
                })
                .catch(() => {
                    setError("Deze gebruiker kan niet worden ingelogd, probeer opnieuw.");
                });
        } else {
            setError("Gegevens kloppen niet.");
        }

    };

    const checkLength = (event) => {
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
                    <img src="./../../assets/sidegolf.jpg" alt="Afbeelding van een grasveld"/>
                </div>

                <div className="ls-form-wrapper">
                    <div className="ls-form">
                        <h2> Login </h2>
                        <form onSubmit={loginHandler} autoComplete="off">
                            <label> gebruikersnaam </label>
                            <input name="username" onBlur={checkLength} minLength="5" type="text"/>
                            <label> wachtwoord </label>
                            <input name="password" onBlur={checkLength} minLength="6" type="password"/>

                            {error ? <p> {error} </p> : ""}

                            <button type="submit"> LOGIN</button>
                        </form>

                        <p> nog geen account? <a href="signup"> aanmelden </a></p>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
};

export default Login;