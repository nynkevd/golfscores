import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {AuthContext} from '../../shared/auth-context';
import {checkFormValid, isMinLength} from "../../shared/validators";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

import TopGolf from "../../assets/sidegolf.jpg";
import './UserInfo.css';

const UserInfo = () => {

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
        currentPassword: {
            value: '',
            valid: false
        },
        newPassword: {
            value: '',
            valid: false
        },
        newPasswordRepeat: {
            value: '',
            valid: false
        }
    });

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [nameError, setNameError] = useState();
    const [usernameError, setUsernameError] = useState();
    const [newPasswordError, setNewPasswordError] = useState();
    const [newPasswordRepeatError, setNewPasswordRepeatError] = useState();

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

        if (!isMinLength(event.target.value, event.target.minLength)) {
            switch (event.target.name) {
                case "name":
                    setNameError("Naam moet minstens " + event.target.minLength + " karakter zijn.");
                    break;
                case "username":
                    setUsernameError("Gebruikersnaam moet minstens " + event.target.minLength + " karakters zijn.");
                    break;
                case "newPassword":
                    setNewPasswordError("Nieuw wachtwoord moet minstens " + event.target.minLength + " karakters zijn.");
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
                case "newPassword":
                    setNewPasswordError(null);
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
        let shouldMatch = document.getElementsByName(event.target.getAttribute('match'))[0].value;
        let areEqual = event.target.value === shouldMatch;

        if (!areEqual) {
            setNewPasswordRepeatError("Nieuwe wachtwoorden komen niet overeen");

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
            setNewPasswordRepeatError(null);
        }
    };

    useEffect(() => {
        (async function loadData() {
            setIsLoading(true);
            await fetch(`${process.env.REACT_APP_API_URL}/user/userinfo/${auth.userId}`, {
                method: 'GET',
                headers: {
                    "authorization": `Bearer ${auth.token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setFormState({
                        ...formState,
                        name: {
                            value: data.name,
                            valid: true
                        },
                        username: {
                            value: data.username,
                            valid: true
                        }
                    });

                    document.getElementById('name').value = data.name;
                    document.getElementById('username').value = data.username;

                })
                .catch((error) => {
                    setError("Kon de data niet ophalen, probeer de pagina opnieuw te laden");
                });
        })();
        setIsLoading(false);
    }, []);

    const changeUserInfo = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);
        console.log(formValid);
        if (formValid) {
            setError(null);
            await fetch(`${process.env.REACT_APP_API_URL}/user/edit`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: formState.name.value,
                    username: formState.username.value,
                    currentPassword: formState.currentPassword.value,
                    newPassword: `${formState.newPassword.value ? formState.newPassword.value : formState.currentPassword.value}`
                }),
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${auth.token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify({
                        name: formState.name.value,
                        username: formState.username.value,
                        currentPassword: formState.currentPassword.value,
                        newPassword: formState.newPassword.value
                    }))
                })
                .catch((error) => {
                    setError("error");
                });
        } else {
            setError("Kan gegevens niet versturen, loop de velden na.");
        }

    };

    const logoutHandler = () => {
        auth.logout();
    };

    return (
        <React.Fragment>
            {isLoading ? <LoadingSpinner asOverlay/> : null}

            <div className="pageHeader">
                <img src={TopGolf} alt="Afbeelding van een grasveld"/>
            </div>

            <div className="pageContent userinfo-page">

                <Link to="/"><p className="breadcrumbs"> &#60; terug naar dashboard </p></Link>

                <h1> Account </h1>

                <form onSubmit={changeUserInfo} autoComplete="off">
                    <label> naam </label>
                    <input id="name" autoCorrect="off" name="name" onBlur={checkLength} minLength="1" type="text"
                           onKeyDown={onEnterPress}/>
                    {nameError ? <p className="warning"> {nameError} </p> : null}

                    <label> gebruikersnaam </label>
                    <input id="username" autoCorrect="off" autoCapitalize="none" name="username" onBlur={checkLength}
                           minLength="5" type="username" onKeyDown={onEnterPress}/>
                    {usernameError ? <p className="warning"> {usernameError} </p> : null}

                    <br/> <br/>
                    <hr/>
                    <br/> <br/>

                    <label> nieuw wachtwoord </label>
                    <input autoCorrect="off" autoCapitalize="none" name="newPassword" onBlur={checkLength}
                           minLength="6" type="password" onKeyDown={onEnterPress}/>
                    {newPasswordError ? <p className="warning"> {newPasswordError} </p> : null}

                    <label> herhaal nieuw wachtwoord </label>
                    <input autoCorrect="off" autoCapitalize="none" name="newPasswordRepeat" onBlur={checkMatching}
                           match="newPassword" type="password" onKeyDown={onEnterPress}/>
                    {newPasswordRepeatError ? <p className="warning"> {newPasswordRepeatError} </p> : null}

                    <br/> <br/>
                    <hr/>
                    <br/> <br/>

                    <label> huidig wachtwoord </label>
                    <input autoCorrect="off" autoCapitalize="none" name="currentPassword" onBlur={checkLength}
                           type="password" onKeyDown={onEnterPress}/>

                    <br/>

                    {error ? <p className="error ls-error"> {error} </p> : null}

                    <button type="submit"> OPSLAAN</button>
                </form>

                <button className="inverse" id="userinfo-logout" onClick={logoutHandler}> UITLOGGEN</button>

            </div>

        </React.Fragment>

    )

};

export default UserInfo;