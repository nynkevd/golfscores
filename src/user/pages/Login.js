import React, {useContext, useState} from 'react';
import {AuthContext} from "../../shared/auth-context";
import {isMinLength} from "../../shared/validators";

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
        let formValid = checkFormValid();

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

    const checkFormValid = () => {
        for (let field in formState) {
            if (!formState[field].valid && field !== "formValid") {
                console.log("nope " + field + "   " + field.valid);
                return false;
            }
        }
        return true;
    };

    return (
        <React.Fragment>
            <h2> Login </h2>
            <form onSubmit={loginHandler}>
                <label> Username </label>
                <input name="username" onBlur={checkLength} minLength="5" type="text"/>
                <label> Password </label>
                <input name="password" onBlur={checkLength} minLength="6" type="text"/>

                {error ? <p> {error} </p> : ""}

                <button type="submit"> LOGIN</button>

                {auth.isLoggedIn ? <p> Logged in </p> : <p> Not logged in </p>}

            </form>
        </React.Fragment>
    )
};

export default Login;