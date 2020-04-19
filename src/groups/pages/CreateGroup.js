import React, {useContext, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import axios from 'axios';

import {AuthContext} from "../../shared/auth-context";
import {isMinLength, onEnterPress} from "../../shared/validators";

import TopGolf from "../../assets/sidegolf2.jpg";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import UserSearchResults from "../components/UserSearchResults";
import "./CreateGroup.css";

const CreateGroup = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();
    const [searchError, setSearchError] = useState();
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState();
    const [nameError, setNameError] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [formState, setFormState] = useState({
        title: {
            value: '',
            valid: false
        },
        invites: []
    });
    const [invitedPlayers, setInvitedPlayers] = useState([]);

    const createGroup = async (event) => {
        setError(null);
        event.preventDefault();
        if (formState.title.valid) {
            setIsLoading(true);
            await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_URL}/group/create`,
                headers: {
                    'X-Auth-Token': auth.token
                },
                data: {
                    title: formState.title.value,
                    invites: formState.invites || []
                }
            }).then((res) => {
                console.log(res);
                setIsLoading(false);
                console.log(res.data.groupId);
                let link = `/groupinfo/${res.data.groupId}`;
                history.push(link);

            }).catch((error) => {
                console.log(error.response.data.message);
                setError(error.response.data.message);
                setIsLoading(false);
            })
        }
    };

    const searchUsers = async () => {
        console.log(invitedPlayers);
        setIsSearchLoading(true);
        setLoadedUsers(undefined);
        setSearchError(null);
        if (searchValue) {
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/user/search/${searchValue}`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                setIsSearchLoading(false);
                let data = res.data;
                if (data.length > 0) {
                    setLoadedUsers(data);
                } else {
                    setSearchError("Er zijn geen gebruikers gevonden");
                }
            }).catch((error) => {
                console.log(error);
                setIsSearchLoading(false);
                setSearchError(error.response.data.message);
            })
        } else {
            setIsSearchLoading(false);
            setSearchError("Voer iets in om te zoeken");
        }

    };

    const addUser = (userId) => {
        setFormState({
            ...formState,
            invites: formState.invites.concat(userId)
        });
    };

    const removePlayer = (userId) => {
        setFormState({
            ...formState,
            invites: formState.invites.filter((inviteUserId) => inviteUserId !== userId)
        });
        setInvitedPlayers(
            invitedPlayers.filter((inviteUser) => inviteUser.userId !== userId),
        );

        console.log(invitedPlayers);

    };

    const handleSearchValue = (event) => {
        setSearchValue(event.target.value);
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

        if (!isMinLength(event.target.value, event.target.minLength)) {
            if (event.target.name === "title") {
                setNameError("Titel moet minstens " + event.target.minLength + " karakter zijn.");
            }
        } else {
            if (event.target.name === "title") {
                setNameError(null);
            }
        }
    };

    return (
        <React.Fragment>
            {isLoading ? <LoadingSpinner asOverlay/> : null}
            <div className="pageHeader">
                <img src={TopGolf} alt="Afbeelding van een grasveld"/>
            </div>

            <div className="pageContent userinfo-page">

                <Link className="breadcrumbs" to="/"><p> &#60; terug naar dashboard </p></Link>

                <h1> Groep Aanmaken</h1>

                <form autoComplete="off" onSubmit={createGroup}>
                    <label> Titel </label>
                    <input autoCorrect="off" name="title" onBlur={checkLength} minLength="5" type="text"
                           onKeyDown={onEnterPress} required/>
                    {nameError ? <p className="warning"> {nameError} </p> : null}

                    <div className="cg-players">

                        <div className="cg-invited">
                            <h2> Uitgenodigd: </h2>
                            <br/>
                            {invitedPlayers.map(player => <p key={player.userId}>
                                <button type="button" className="negative remove"
                                        onClick={() => removePlayer(player.userId)}> X
                                </button>
                                {player.name} </p>)}
                        </div>

                        <div className="cg-searching">

                            <label> Zoek spelers </label>
                            <div className="cg-searchbar">
                                <input autoCorrect="off" name="search" onBlur={handleSearchValue} minLength="1"
                                       type="text"
                                       onKeyDown={onEnterPress}/>
                                <button type="button" onClick={searchUsers}>ZOEK</button>
                            </div>

                            <div>
                                {loadedUsers ? <UserSearchResults items={loadedUsers} addUser={addUser}
                                                                  invitedPlayers={invitedPlayers}
                                                                  setInvitedPlayers={setInvitedPlayers}/> : null}
                                {searchError ? <p className="warning"> {searchError} </p> : null}
                                {isSearchLoading ? <LoadingSpinner/> : null}
                            </div>

                        </div>

                    </div>


                    {error ? <p className="error"> {error} </p> : null}
                    <button type="submit" className="cg-submit"> GROEP MAKEN</button>

                </form>
            </div>
        </React.Fragment>
    )
};

export default CreateGroup;