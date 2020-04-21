import React, {useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";

import {AuthContext} from "../../../shared/auth-context";

const GroupMatchItem = props => {

    const auth = useContext(AuthContext);
    const {groupId} = useParams();

    const deleteMatch = async () => {
        if (window.confirm("Weet je zeker dat je deze wedstrijd wil verwijderen?")) {
            await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/match/remove`,
                data: {
                    matchId: props.matchId,
                    groupId,
                },
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                props.forceUpdate(!props.update);
            }).catch((error) => {

            });
        }
    };

    return (
        <div className="groupMatchItem">
            <button type="button" className="negative remove"
                    onClick={deleteMatch}> X
            </button>
            <p> {props.date} </p>
        </div>
    );
};

export default GroupMatchItem;