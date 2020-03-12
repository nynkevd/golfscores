import React, {useState, useContext} from 'react';

import {AuthContext} from "../../shared/auth-context";
import {isMinLength, checkFormValid} from "../../shared/validators";

import SideGolf2 from './../../assets/sidegolf2.jpg';
import './LoginSignup.css';

const Signup = () => {

    const auth = useContext(AuthContext);
    const [formState, setFormState] = useState({
        name: {
            value: '',
            valid: false
        },
        username: {
            value: '',
            valid: false
        },
        password: {
            value: '',
            valid: false
        },
        passwordRepeat: {
            value: '',
            valid: false
        }
    });
    const [error, setError] = useState();
    const [nameError, setNameError] = useState();
    const [usernameError, setUsernameError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [repeatError, setRepeatError] = useState();

    console.log(JSON.stringify(formState));

    const signupHandler = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);

        if (formValid) {
            console.log("Creating user");
            await fetch(` ${process.env.REACT_APP_API_URL}/user/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    name: formState.username.value,
                    username: formState.username.value,
                    password: formState.username.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    auth.login(data.userId, data.token);
                })
                .catch(() => {
                    setError("Er bestaat al een gebruiker met deze gebruikersnaam.");
                });
        } else {
            setError("Kan geen account maken, loop de gegevens na");
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

        console.log(!isMinLength(event.target.value, event.target.minLength));
        if (!isMinLength(event.target.value, event.target.minLength)) {
            switch (event.target.name) {
                case "name":
                    setNameError("Naam moet minstens " + event.target.minLength + " karakter zijn.");
                    break;
                case "username":
                    setUsernameError("Gebruikersnaam moet minstens " + event.target.minLength + " karakters zijn.");
                    break;
                case "password":
                    setPasswordError("Wachtwoord moet minstens " + event.target.minLength + " karakters zijn.");
                    break;
                default:
                    break;
            }
        } else {
            switch (event.target.name) {
                case "name":
                    setNameError(null);
                    break;
                case "username":
                    setUsernameError(null);
                    break;
                case "password":
                    setPasswordError(null);
                    break;
                default:
                    break;
            }
        }
    };

    const onEnterPress = (event) => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            event.target.blur();
        }
    };

    const checkMatching = (event) => {
        console.log("Checking if matching");
        let shouldMatch = document.getElementsByName(event.target.getAttribute('match'))[0].value;
        let areEqual = event.target.value === shouldMatch;
        console.log(event.target.value === shouldMatch);

        if (!areEqual) {
            setRepeatError("Wachtwoorden komen niet overeen");

            setFormState({
                ...formState,
                [event.target.name]: {
                    value: event.target.value,
                    valid: false
                }
            });
        }

        if (event.target.name in formState && areEqual) {
            setFormState({
                ...formState,
                [event.target.name]: {
                    value: event.target.value,
                    valid: true
                }
            });
            setRepeatError(null);
        }
    };

    return (

        <React.Fragment>
            <div className="ls-page">
                <div className="ls-image">
                    <img src={SideGolf2} alt="Afbeelding van een grasveld"/>
                </div>

                <div className="ls-form-wrapper">
                    <div className="ls-form">

                        <h2> Aanmelden </h2>

                        <form onSubmit={signupHandler} autoComplete="off">
                            <label> naam </label>
                            <input autoCorrect="off" name="name" onBlur={checkLength} minLength="1" type="text"
                                   onKeyDown={onEnterPress}/>
                            {nameError ? <p className="warning"> {nameError} </p> : null}

                            <label> gebruikersnaam </label>
                            <input autoCorrect="off" autoCapitalize="none" name="username" onBlur={checkLength}
                                   minLength="5" type="username" onKeyDown={onEnterPress}/>
                            {usernameError ? <p className="warning"> {usernameError} </p> : null}

                            <label> wachtwoord </label>
                            <input autoCorrect="off" autoCapitalize="none" name="password" onBlur={checkLength}
                                   minLength="6" type="password" onKeyDown={onEnterPress}/>
                            {passwordError ? <p className="warning"> {passwordError} </p> : null}

                            <label> herhaal wachtwoord </label>
                            <input autoCorrect="off" autoCapitalize="none" name="passwordRepeat" onBlur={checkMatching}
                                   match="password" type="password" onKeyDown={onEnterPress}/>
                            {repeatError ? <p className="warning"> {repeatError} </p> : null}

                            <br/>

                            {error ? <p className="error ls-error"> {error} </p> : null}

                            <button type="submit"> AANMELDEN</button>
                        </form>

                        <p className="ls-footer"> heb je al een account? <a href="/login"> inloggen </a></p>
                    </div>
                </div>
            </div>
        </React.Fragment>

    )
};

export default Signup;