import React from 'react';
import {useParams} from "react-router-dom";

import './MatchItem.css';

const MatchItem = props => {
    let {groupId} = useParams();
    const baseMatchLink = `/groupinfo/${groupId}/match/`;

    console.log(props.results);
    let counter = 0;

    return (
        <React.Fragment>
            <div className="matchItem">
                <h3> {props.date} </h3>
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
                                    <React.Fragment>
                                        <p> {counter}.</p>
                                        <p> {result.name} </p>
                                        <p> {result.score} </p>
                                    </React.Fragment>
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