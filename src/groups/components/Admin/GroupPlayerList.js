import React, {useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";

import {AuthContext} from "../../../shared/auth-context";

const GroupPlayerList = props => {
    const auth = useContext(AuthContext);

    const players = props.players;
    const admins = props.admins;
    const possibleAdmins = props.possibleAdmins;

    const {groupId} = useParams();
    const [adminWarning, setAdminWarning] = useState();

    const confirmDelete = async (userId, name) => {
        setAdminWarning(null);
        if (window.confirm("Weet je zeker dat je " + name + " wil verwijderen uit de groep?")) {
            await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/group/removeplayer`,
                data: {
                    playerId: userId,
                    groupId
                },
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                props.forceUpdate(!props.update);
            }).catch((error) => {
                setAdminWarning(error.response.data.message);
            });
        }
    };

    const confirmAdminDelete = async (userId, name) => {
        setAdminWarning(null);
        if (window.confirm("Weet je zeker dat je " + name + " wil verwijderen van de admins?")) {
            await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_URL}/group/removeadmin`,
                data: {
                    adminId: userId,
                    groupId
                },
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                props.forceUpdate(!props.update);
            }).catch((error) => {
                setAdminWarning(error.response.data.message);
            });
        }
    };

    const addAdmin = async () => {
        setAdminWarning(null);
        await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_URL}/group/addadmin`,
            data: {
                newAdminId: document.getElementById('newadmingai').value,
                groupId
            },
            headers: {
                'X-Auth-Token': auth.token,
            }
        }).then((res) => {
            props.forceUpdate(!props.update);
        }).catch((error) => {
            setAdminWarning(error.response.data.message);
        });
    }

    return (
        <React.Fragment>
            <h3> Spelers </h3>
            {players && players.length > 0 ?
                players.map((player) =>
                    <p key={player.id}>
                        <button type="button" className="negative remove"
                                onClick={() => confirmDelete(player.id, player.name)}> X
                        </button>
                        {player.name} </p>
                ) :
                <p className="warning"> Geen spelers gevonden </p>
            }

            <h3> Admins </h3>
            {admins && admins.length > 0 ?
                admins.map((admin) =>
                    <p key={admin.id}>
                        <button type="button" className="negative remove"
                                onClick={() => confirmAdminDelete(admin.id, admin.name)}> X
                        </button>
                        {admin.name} </p>
                ) :
                <p className="warning"> Geen admins gevonden </p>
            }
            {possibleAdmins && possibleAdmins.length > 0 ?
                <React.Fragment>
                    <select id="newadmingai">
                        {possibleAdmins.map((possibleAdmin) =>
                            <option value={possibleAdmin.id} key={possibleAdmin.id}> {possibleAdmin.name} </option>
                        )}
                    </select>
                    <button type="button" onClick={addAdmin}> ADMIN TOEVOEGEN</button>
                </React.Fragment>
                : null}

            {adminWarning ? <p className="error"> {adminWarning} </p> : null}
        </React.Fragment>
    )
};

export default GroupPlayerList;