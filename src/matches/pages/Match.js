import React, {useContext, useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';

import axios from "axios";
import {AuthContext} from "../../shared/auth-context";

import Topgolf2 from "../../assets/topgolf2.jpeg";
import Result from "../components/Result";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

const Match = () => {
    const auth = useContext(AuthContext);
    const {groupId, matchId} = useParams();
    const link = `/groupinfo/${groupId}`;
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState();
    const [scores, setScores] = useState({});
    const [error, setError] = useState();

    useEffect(() => {
        (async function checkIfAdmin() {
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
    });

    useEffect(() => {
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/match/matchinfo/${matchId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                setIsLoading(false);
                setPlayers(res.data.players);
            })
        })();
    }, []);

    const submitMatchResults = async () => {
        if (window.confirm("Weet je zeker dat je de onderstaande resultaten wil invullen, deze actie kan niet ongedaan worden.")) {
            setIsLoading(true);
            await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_URL}/match/entermatchresults`,
                data: {
                    groupId,
                    matchId,
                    scores
                },
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                setIsLoading(false);
                history.push(link);
            }).catch((error) => {
                setIsLoading(false);
                setError(error.response.data.message);
            });
        }
    };

    return (
        <React.Fragment>
            {isLoading ? <LoadingSpinner asOverlay/> : null}
            <div className="pageHeader">
                <img src={Topgolf2} alt="Afbeelding van een golf koers"/>
            </div>

            <div className="pageContent">
                <Link className="breadcrumbs" to={link}><p> &#60; terug naar de groep </p></Link>

                {players && players.length > 0 ?
                    players.map((player) =>
                        <Result key={player.id} name={player.name} playerId={player.id} setScores={setScores}
                                scores={scores}/>
                    ) :
                    <p className="warning"> Geen spelers gevonden </p>
                }

                <button onClick={submitMatchResults}> INVOEREN</button>
                {error ? <p className="error"> {error} </p> : null}
            </div>
        </React.Fragment>
    );
};

export default Match;