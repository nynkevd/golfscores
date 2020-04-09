import React, {useContext, useEffect, useState} from 'react';

import "./Dashboard.css";
import {AuthContext} from "../../shared/auth-context";
import {Link} from "react-router-dom";
import axios from "axios";
import GroupInvite from "../../groups/components/GroupInvite";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import GroupItem from "../../groups/components/GroupItem";

const Dashboard = () => {

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState();
    const [isInviteLoading, setIsInviteLoading] = useState();
    const [invites, setInvites] = useState(null);
    const [groups, setGroups] = useState();


    useEffect(() => {
        console.log(auth.token);
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/user/dashboard`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                console.log(res.data);
                setInvites(res.data.invites);
                setGroups(res.data.groups);
            })
        })();
        setIsLoading(false);
    }, []);


    const logoutHandler = () => {
        auth.logout();
    };

    return (
        <React.Fragment>

            <br/> <br/>
            <div className="pageContent">
                <Link to="/userinfo">
                    <button> EDIT USER</button>
                </Link>

                <Link to="/creategroup">
                    <button> CREATE GROUP</button>
                </Link>

                <h2> Groepen </h2>
                <div className="groups grid">
                    {groups ? groups.map(group => <GroupItem key={group} groupId={group}> </GroupItem>) :
                        <p> Geen groepen gevonden, maak <a href="/creategroup"> hier </a> een eigen groep aan. </p>}
                </div>

                <h2> Uitnodigingen </h2>
                <div className="invites grid">
                    {invites ? invites.map(invite => <GroupInvite setIsInviteLoading={setIsInviteLoading}
                                                                  inviteId={invite} key={invite}/>) :
                        <p> Momenteel geen uitnodigingen </p>}

                    {isInviteLoading ? <LoadingSpinner asOverlay/> : null}
                </div>


                <button onClick={logoutHandler}> LOGOUT</button>
            </div>


        </React.Fragment>
    )
};

export default Dashboard;