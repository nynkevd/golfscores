import React, {useContext, useEffect, useState} from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Topgolf from "../../assets/topgolf.jpeg";

import {AuthContext} from "../../shared/auth-context";
import GroupPlayerList from "../components/Admin/GroupPlayerList";
import GroupInviteList from "../components/Admin/GroupInviteList";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import Match from "../../matches/pages/Match";
import MatchItem from "../../matches/components/MatchItem";
import GroupMatchItem from "../components/Admin/GroupMatchItem";

const GroupInfoAdmin = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const {groupId} = useParams();
    let link = `/groupinfo/${groupId}`;
    const [update, forceUpdate] = useState(false);
    const [message, setMessage] = useState();
    const [matches, setMatches] = useState();
    const [players, setPlayers] = useState();
    const [admins, setAdmins] = useState();
    const [possibleAdmins, setPossibleAdmins] = useState();
    const [invitedPlayers, setInvitedPlayers] = useState();
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        (async function checkIfAdmin() {
            setIsLoading(true);
            console.log("checking");
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/group/checkIfAdmin/${groupId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {

            }).catch((error) => {
                history.push(link);
            })
        })();
    }, [update]);

    useEffect(() => {
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/group/groupAdminInfo/${groupId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                setMatches(res.data.matches);
                setPlayers(res.data.players);
                setInvitedPlayers(res.data.invites);
                setAdmins(res.data.admins);
                setPossibleAdmins(res.data.possibleAdmins);
                setIsLoading(false);
            }).catch((error) => {
                setIsLoading(false);
                history.push(link);
            })
        })();
    }, [update]);

    useEffect(() => {
        document.getElementById("matchDate").value = moment().format("YYYY-MM-DD");
    }, []);

    const addMatch = async () => {
        let date = document.getElementById("matchDate").value;

        await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_URL}/match/add`,
            headers: {
                'X-Auth-Token': auth.token
            },
            data: {
                dates: [moment(date).format("DD-MM-YYYY")],
                groupId
            }
        }).then((res) => {
            let data = res.data;
            setMessage(data.message);
            forceUpdate(!update);

        }).catch((error) => {
            setMessage(error.response.data.message);
        })

    };

    return (

        <React.Fragment>
            {isLoading ? <LoadingSpinner asOverlay/> : null}
            <div className="pageHeader">
                <img src={Topgolf} alt="Afbeelding van een golf koers"/>
            </div>

            <div className="pageContent">

                <Link className="breadcrumbs" to={link}><p> &#60; terug naar de groep </p></Link>

                <h3> Wedstrijden beheren </h3>
                <h4> Overzicht </h4>
                {matches ? matches.map((match) => {
                    return (<GroupMatchItem date={match.date} matchId={match.id} forceUpdate={forceUpdate}
                                            update={update}/>)
                }) : null}

                <h4> Toevoegen </h4>
                <input id="matchDate" type="date"/>
                {message ? <p> {message} </p> : null}
                <button type="button" onClick={addMatch}> TOEVOEGEN</button>

                <h4> Verwijderen </h4>

                <h3> Spelers beheren</h3>
                <GroupPlayerList players={players} admins={admins} possibleAdmins={possibleAdmins}
                                 forceUpdate={forceUpdate} update={update}/>

                <h4> Uitgenodigde spelers </h4>
                <GroupInviteList invitedPlayers={invitedPlayers} setInvitedPlayers={setInvitedPlayers}
                                 forceUpdate={forceUpdate} update={update}/>


            </div>

        </React.Fragment>

    );
};

export default GroupInfoAdmin;