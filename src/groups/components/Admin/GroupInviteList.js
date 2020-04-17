import React, {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";

import {AuthContext} from "../../../shared/auth-context";

const GroupInviteList = props => {
    const {groupId} = useParams();
    const auth = useContext(AuthContext);

    const invitedPlayers = props.invitedPlayers;
    const [username, setUsername] = useState("");
    const [warning, setWarning] = useState();

    const invitePlayer = async () => {
        setWarning("");
        if (username.length < 1) {
            setWarning("Gebruikersnaam moet ingevuld zijn");
            return;
        }
        await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_URL}/invite/invitebyusername`,
            headers: {
                'X-Auth-Token': auth.token
            },
            data: {
                username,
                groupId
            }
        }).then((res) => {
            props.forceUpdate(!props.update);
        }).catch((error) => {
            setWarning(error.response.data.message);
        })
    }

    const deleteInvite = async (inviteId, invitePlayer) => {
        if (window.confirm("Weet je zeker dat je de uitnodiging voor " + invitePlayer + " wil verwijderen?")) {
            await axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_API_URL}/invite/delete/${inviteId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                props.forceUpdate(!props.update);
            }).catch((error) => {
                setWarning(error.response.data.message);
            });
        }
    };

    const handleUsernameInput = event => {
        setUsername(event.target.value);
    };

    return (
        <React.Fragment>
            {invitedPlayers && invitedPlayers.length > 0 ?
                invitedPlayers.map((invite) =>
                    <p key={invite.id}>
                        <button type="button" className="negative remove"
                                onClick={() => deleteInvite(invite.id, invite.player)}> X
                        </button>
                        {invite.player} </p>
                ) :
                <p className="warning"> Geen spelers gevonden </p>
            }

            <label> Gebruikersnaam </label>
            <input type="text" onChange={handleUsernameInput}/>
            {warning ? <p className="warning"> {warning} </p> : null}
            <button type="button" onClick={invitePlayer}> UITNODIGEN</button>

        </React.Fragment>
    )
};

export default GroupInviteList;