import React, {useContext, useEffect, useState} from 'react';

import "./Dashboard.css";
import {AuthContext} from "../../shared/auth-context";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import GroupInvite from "../../groups/components/GroupInvite";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import GroupItem from "../../groups/components/GroupItem";
import SideGolf from "../../assets/sidegolf.jpg";

const Dashboard = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [update, forceUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const [isInviteLoading, setIsInviteLoading] = useState();
    const [name, setName] = useState();
    const [invites, setInvites] = useState(null);
    const [groups, setGroups] = useState();

    useEffect(() => {
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/user/dashboard`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                setName(res.data.name);
                setInvites(res.data.invites);
                setGroups(res.data.groups);
            }).catch((error) => {
                if (error.response.status === 401) {
                    window.location.reload();
                }
            });
        })();
        setIsLoading(false);
    }, [update]);

    if (!auth.token) {
        history.push('/hallo');
    }


    const toCreateGroup = () => {
        history.push("/creategroup");
    };

    const toEditAccount = () => {
        history.push("/userinfo");
    };

    return (
        <React.Fragment>
            {isLoading ? <LoadingSpinner asOverlay/> : null}
            <div className="pageHeader">
                <img src={SideGolf} alt="Afbeelding van een grasveld"/>
            </div>
            <div className="pageContent dashboard">

                {name ?
                    <h2 className="welcome"> Welkom, {name} <i onClick={toEditAccount} className="fas fa-user-cog"> </i>
                    </h2> : <h2> Welkom <i onClick={toEditAccount} className="fas fa-user-cog"> </i></h2>}

                <h2> Mijn groepen </h2>
                {!(groups && groups.length > 0) ?
                    <p> Geen groepen gevonden, maak <a href="/creategroup"> hier</a> een eigen groep aan. </p> : null}
                <div className="groups grid">
                    {groups && groups.length > 0 ? groups.map(group => <GroupItem key={group}
                                                                                  groupId={group}> </GroupItem>) :
                        null}

                    {groups && groups.length > 0 ?
                        <div className="card creategroup" onClick={toCreateGroup}>
                            <p>+</p>
                        </div>
                        : null}
                </div>

                <h2> Uitnodigingen </h2>
                <div className="invites grid">
                    {invites && invites.length > 0 ? invites.map(invite => <GroupInvite
                            setIsInviteLoading={setIsInviteLoading}
                            inviteId={invite} key={invite} update={update} forceUpdate={forceUpdate}/>) :
                        <p> Momenteel geen uitnodigingen. </p>}

                    {isInviteLoading ? <LoadingSpinner asOverlay/> : null}
                </div>
            </div>


        </React.Fragment>
    )
};

export default Dashboard;