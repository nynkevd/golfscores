import React from 'react';
import {useParams} from "react-router-dom";

import './MatchItem.css';

const MatchItem = props => {
    let {groupId} = useParams();
    const baseMatchLink = `/groupinfo/${groupId}/match/`;

    let counter = 0;

    return (
        <React.Fragment>
            <div className="matchItem card">
                <p className="card--title"> {props.date} </p>
                {props.noResults ? (
                    <React.Fragment>
                        <p> Deze wedstrijd heeft nog geen resultaten.</p>
                        {props.isAdmin ?
                            <a href={baseMatchLink + props.match}> resultaten invullen > </a> :
                            <p> vraag een admin resultaten in te vullen </p>
                        }
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {props.results ? props.results.map((result) => {
                            if (result.score) {
                                counter++;
                                return (
                                    <div className="item-result" key={counter}>
                                        <p> {counter}.</p>
                                        <p> {result.name} </p>
                                        <p> {result.score} </p>
                                    </div>
                                );
                            }


                        }) : null}
                    </React.Fragment>
                )}

            </div>
        </React.Fragment>
    )
};

export default MatchItem;