import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import axios from "axios";

import "./GroupInvite.css";

import {AuthContext} from "../../shared/auth-context";

const GroupInvite = props => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const [inviteInfo, setInviteInfo] = useState({groupName: '', inviter: '', inviteId: '', players: null});

    useEffect(() => {
        (async function loadData() {
            props.setIsInviteLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/invite/inviteinfo/${props.inviteId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                props.setIsInviteLoading(false);
                setInviteInfo({
                    ...inviteInfo,
                    groupName: res.data.groupName,
                    inviter: res.data.inviter,
                    inviteId: res.data.inviteId,
                    players: res.data.players

                })
            })
        })();
    }, []);

    const acceptInvite = async (event) => {
        event.persist();
        await axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_API_URL}/invite/accept/${inviteInfo.inviteId}`,
            headers: {
                'X-Auth-Token': auth.token,
            }
        }).then((res) => {
            console.log(res);
            event.target.parentNode.parentNode.remove();
            let link = `/groupinfo/${res.data.groupId}`;
            history.push(link);
        }).catch((error) => {
            console.log(error.response.data.message);
        });
    };

    const declineInvite = async (event) => {
        event.persist();
        await axios({
            method: 'PATCH',
            url: `${process.env.REACT_APP_API_URL}/invite/decline/${inviteInfo.inviteId}`,
            headers: {
                'X-Auth-Token': auth.token,
            }
        }).then((res) => {
            event.target.parentNode.parentNode.remove();
        }).catch((error) => {
            console.log(error.response.data.message);
        });
    };

    return (
        <React.Fragment>
            <div className="invite">
                <div>
                    <p><em> Voor: </em> {inviteInfo.groupName} </p>
                    <p><em> Door: </em> {inviteInfo.inviter} </p>
                    {inviteInfo.players ?
                        inviteInfo.players.length > 0 ?
                            <p><em> Speler(s): </em> {inviteInfo.players.map(player => player + ", ")} </p> : null
                        : null}
                </div>


                <div>
                    <button className="negative" onClick={declineInvite}> AFWIJZEN</button>
                    <button onClick={acceptInvite}> ACCEPTEREN</button>
                </div>
            </div>
        </React.Fragment>
    )

};

export default GroupInvite;