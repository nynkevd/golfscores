import React, {useContext, useState} from 'react';

import {AuthContext} from "../../shared/auth-context";
import {isMinLength, matches, checkFormValid} from "../../shared/validators";

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

    console.log(JSON.stringify(formState));

    const signupHandler = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);

        if (formValid) {
            console.log("Creating user");
            // await fetch(` ${process.env.REACT_APP_API_URL}/user/signup`, {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         name: formState.username.value,
            //         username: formState.username.value,
            //         password: formState.username.value
            //     }),
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // })
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(data);
            //         auth.login(data.userId, data.token);
            //     })
            //     .catch(() => {
            //         setError("Er bestaat al een gebruiker met deze gebruikersnaam.");
            //     });
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
    };

    const checkMatching = (event) => {
        console.log("Checking if matching");
        let shouldMatch = document.getElementsByName(event.target.getAttribute('match'))[0].value;
        let areEqual = event.target.value === shouldMatch;
        console.log(event.target.value === shouldMatch);

        if (!areEqual) {
            console.log("Nope");
            setError("Wachtwoorden komen niet overeen");

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
            setError(null);
        }
    };

    return (

        <React.Fragment>
            <div className="ls-page">
                <div className="ls-image">
                    <img src="../../../assets/sidegolf.jpg" alt="Afbeelding van een grasveld"/>
                </div>

                <div className="ls-form-wrapper">
                    <div className="ls-form">

                        <h2> Aanmelden </h2>

                        <form onSubmit={signupHandler} autoComplete="off">
                            <label> Name </label>
                            <input name="name" onBlur={checkLength} minLength="1" type="text"/>
                            <label> Username </label>
                            <input name="username" onBlur={checkLength} minLength="5" type="username"/>
                            <label> Password </label>
                            <input name="password" onBlur={checkLength} minLength="6" type="new-password"/>
                            <label> Repeat Password </label>
                            <input name="passwordRepeat" onBlur={checkMatching} match="password" type="new-password"/>

                            {error ? <p> {error} </p> : null}

                            <button type="submit"> AANMELDEN</button>
                        </form>

                        <p> heb je al een account? <a href="/login"> inloggen </a></p>
                    </div>
                </div>
            </div>
        </React.Fragment>

    )
};

export default Signup;