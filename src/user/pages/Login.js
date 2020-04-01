import React, {useContext, useState} from 'react';
import {AuthContext} from "../../shared/auth-context";
import {BrowserRouter as Redirect} from "react-router-dom";
import {isMinLength, checkFormValid, onEnterPress} from "../../shared/validators";

import axios from 'axios';

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

    const loginHandler = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);

        if (formValid) {

            await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_URL}/user/login`,
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    username: formState.username.value,
                    password: formState.password.value
                }
            }).then((res) => {
                let data = res.data;
                auth.login(data.userId, data.token);
                axios.defaults.headers['Content-Type'] = "application/json";
                axios.defaults.headers['x-auth-token'] = data.token;
                console.log(axios.defaults.headers);
                return <Redirect to="/"/>
            }).catch((error) => {
                setError(error.response.data.message);
            })
        } else {
            setError("Gegevens kloppen niet.");
        }
    };

    const changeForm = (event) => {
        setError(null);
        if (event.target.name in formState) {
            setFormState({
                ...formState,
                [event.target.name]: {
                    value: event.target.value,
                    valid: true
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
                            <input autoCorrect="off" autoCapitalize="none" name="username" onChange={changeForm}
                                   type="text"/>
                            <label> wachtwoord </label>
                            <input autoCorrect="off" autoCapitalize="none" name="password" onChange={changeForm}
                                   type="password"/>

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