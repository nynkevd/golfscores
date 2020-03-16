import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter as Redirect, Link} from "react-router-dom";

import {AuthContext} from '../../shared/auth-context';
import {checkFormValid, isMinLength, onEnterPress} from "../../shared/validators";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

import TopGolf from "../../assets/sidegolf.jpg";
import './UserInfo.css';
import axios from "axios";

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
        description: {
            value: '',
            valid: true
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
    const [success, setSuccess] = useState();
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
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/user/userinfo/${auth.userId}`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                setIsLoading(false);
                console.log("res");
                let data = res.data;
                setFormState({
                    ...formState,
                    name: {
                        value: data.name,
                        valid: true
                    },
                    username: {
                        value: data.username,
                        valid: true
                    },
                    description: {
                        value: data.description,
                        valid: true
                    }
                });

                document.getElementById('name').value = data.name;
                document.getElementById('username').value = data.username;
                document.getElementById('description').value = data.description;
            }).catch((error) => {
                setIsLoading(false);
                console.log(error);
                setError(error.response.data.message);
            })
        })();
        setIsLoading(false);
    }, []);

    const changeUserInfo = async (event) => {
        event.preventDefault();
        let formValid = checkFormValid(formState);
        if (formValid) {
            setIsLoading(true);
            setSuccess(null);
            setError(null);

            await axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_API_URL}/user/edit`,
                headers: {
                    'X-Auth-Token': auth.token
                },
                data: {
                    name: formState.name.value,
                    username: formState.username.value,
                    description: formState.description.value || "",
                    currentPassword: formState.currentPassword.value,
                    newPassword: `${formState.newPassword.value ? formState.newPassword.value : formState.currentPassword.value}`
                }
            }).then((res) => {
                setIsLoading(false);
                console.log(res);
                let data = res.data;
                setSuccess(data.message);
                let inputs = document.querySelectorAll("input[type='password']");
                for (const input of inputs) {
                    input.value = '';
                }
            }).catch((error) => {
                setIsLoading(false);
                console.log(error);
                setError(error.response.data.message);
            })
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

                <Link className="breadcrumbs" to="/"><p> &#60; terug naar dashboard </p></Link>

                <h1> Account </h1>

                <form onSubmit={changeUserInfo} autoComplete="off">
                    <label> naam </label>
                    <input id="name" autoCorrect="off" name="name" onBlur={checkLength} minLength="1" type="text"
                           onKeyDown={onEnterPress} required/>
                    {nameError ? <p className="warning"> {nameError} </p> : null}

                    <label> gebruikersnaam </label>
                    <input id="username" autoCorrect="off" autoCapitalize="none" name="username" onBlur={checkLength}
                           minLength="5" type="username" onKeyDown={onEnterPress} required/>
                    {usernameError ? <p className="warning"> {usernameError} </p> : null}

                    <label> beschrijving </label>
                    <textarea id="description" autoCorrect="off" name="description" onBlur={checkLength}
                              minLength="0" onKeyDown={onEnterPress}
                              placeholder="Voer hier overige informatie in die het makkelijker maakt voor anderen je te vinden. Zet hier geen vertrouwelijke informatie in. (optioneel)"/>
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
                           type="password" onKeyDown={onEnterPress} required/>

                    <br/>

                    {error ? <p className="error userinfo-error"> {error} </p> : null}
                    {success ? <p className="success"> {success} </p> : null}

                    <button type="submit"> OPSLAAN</button>
                </form>

                <button className="inverse" id="userinfo-logout" onClick={logoutHandler}> UITLOGGEN</button>

            </div>

        </React.Fragment>

    )

};

export default UserInfo;