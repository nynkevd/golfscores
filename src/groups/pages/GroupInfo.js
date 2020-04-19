import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from "axios";

import Topgolf from "../../assets/topgolf.jpeg";
import {AuthContext} from "../../shared/auth-context";
import MatchItem from "../../matches/components/MatchItem";

import './GroupInfo.css';

const GroupInfo = () => {
    let {groupId} = useParams();
    const auth = useContext(AuthContext);
    const adminLink = `/groupinfo/${groupId}/admin`;

    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [playerResults, setPlayerResults] = useState();
    const [matchToday, setMatchToday] = useState();
    const [matches, setMatches] = useState();
    const [prevMatches, setPrevMatches] = useState();
    const [forbidden, setForbidden] = useState(false);

    let counter = 0;

    useEffect(() => {
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/group/groupinfo/${groupId}`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                setIsAdmin(res.data.isAdmin || null);
                setGroupName(res.data.groupName || null);
                setPlayerResults(res.data.standings || null);
                setMatchToday(res.data.matchToday || null);
                setMatches(res.data.matches || null);
                setPrevMatches(res.data.prevMatches || null);
            }).catch((error) => {
                if (error.response.status === 403) {
                    setForbidden(true);
                }
            })
        })();
        setIsLoading(false);
    }, []);

    return (
        <React.Fragment>
            <div className="pageHeader">
                <img src={Topgolf} alt="Afbeelding van een grasveld"/>
            </div>

            <div className="pageContent">

                <Link className="breadcrumbs" to="/"><p> &#60; terug naar dashboard </p></Link>

                {forbidden ? <p className="error"> Je bent geen deel van deze groep, vraag de eigenaar je toe te
                    voegen. </p> : null}

                <h2> {groupName} </h2>

                <div className="results">
                    {playerResults ? playerResults.map((player) => {
                        counter++;
                        return (
                            <div className="item-result" key={counter}>
                                <p> {counter}.</p>
                                <p> {player.name} </p>
                                <p> {player.average} </p>
                            </div>
                        );
                    }) : null}
                </div>

                {matchToday ?
                    <React.Fragment>
                        <h3> Vandaag: </h3>
                        {matchToday.results ?
                            <MatchItem key={matchToday.id} results={matchToday.results} date={matchToday.date}/> :
                            <MatchItem key={matchToday.id} noResults date={matchToday.date} match={matchToday.id}
                                       isAdmin={isAdmin}/>}
                    </React.Fragment>
                    : null}

                <h3> Komende wedstrijden: </h3>
                <div className="matches grid">
                    {matches ? matches.map((match) => {
                            if (match.results) {
                                return (<MatchItem key={match.id} results={match.results} date={match.date}/>);
                            } else {
                                return (<MatchItem key={match.id} noResults date={match.date} match={match.id}
                                                   isAdmin={isAdmin}/>);
                            }
                        }
                    ) : null}
                </div>

                <h3> Vorige wedstrijden: </h3>
                <div className="matches grid">
                    {prevMatches ? prevMatches.map((match) => {
                            if (match.results) {
                                return (<MatchItem key={match.id} results={match.results} date={match.date}/>)
                            } else {
                                return (<MatchItem key={match.id} noResults date={match.date} match={match.id}
                                                   isAdmin={isAdmin}/>)

                            }
                        }
                    ) : null}
                </div>


                {isAdmin ? <a href={adminLink}> admin </a> : null}
            </div>
        </React.Fragment>
    )
};

export default GroupInfo;