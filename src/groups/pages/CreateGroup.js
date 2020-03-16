import React, {useState} from 'react';
import {Link} from "react-router-dom";

import {isMinLength, onEnterPress} from "../../shared/validators";

import TopGolf from "../../assets/sidegolf2.jpg";

const CreateGroup = () => {

    const [error, setError] = useState();
    const [nameError, setNameError] = useState();
    const [formState, setFormState] = useState({
        name: {
            value: '',
            valid: false
        },
        users: []
    });

    const createGroup = () => {

    };

    const searchUsers = () => {

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
            <div className="pageHeader">
                <img src={TopGolf} alt="Afbeelding van een grasveld"/>
            </div>

            <div className="pageContent userinfo-page">

                <Link className="breadcrumbs" to="/"><p> &#60; terug naar dashboard </p></Link>

                <h1> Groep Aanmaken</h1>

                <form onSubmit={createGroup}>
                    <label> naam </label>
                    <input autoCorrect="off" name="name" onBlur={checkLength} minLength="3" type="text"
                           onKeyDown={onEnterPress} required/>
                    {nameError ? <p className="warning"> {nameError} </p> : null}


                    <label> zoek spelers </label>
                    <div className="cg-searchbar">
                        <input autoCorrect="off" name="name" onBlur={checkLength} minLength="3" type="text"
                               onKeyDown={onEnterPress} required/>
                        <button> ZOEK</button>
                    </div>

                    <button type="submit"> GROEP MAKEN</button>

                </form>


            </div>
        </React.Fragment>
    )
};

export default CreateGroup;