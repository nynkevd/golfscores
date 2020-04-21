import React, {useContext, useEffect, useState} from 'react';

import axios from "axios";

import "./GroupItem.css";

import {AuthContext} from "../../shared/auth-context";

const GroupItem = props => {
    const auth = useContext(AuthContext);
    const [groupItemInfo, setGroupItemInfo] = useState({
        groupName: '',
        groupId: props.groupId,
        standings: []
    });
    let link = `/groupinfo/${props.groupId}`;
    let counter = 0;

    useEffect(() => {
        (async function loadData() {
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/group/groupiteminfo/${props.groupId}`,
                headers: {
                    'X-Auth-Token': auth.token,
                }
            }).then((res) => {
                setGroupItemInfo({
                    ...groupItemInfo,
                    groupName: res.data.groupName,
                    standings: res.data.standings,
                    nextMatch: res.data.nextMatch
                });

            })
        })();
    }, []);

    return (
        <React.Fragment>
            <div className="groupItem card">
                <div>
                    <p className="card--title">{groupItemInfo.groupName}</p>

                    <div className="groupStandings">
                        {groupItemInfo.standings.length > 0 ?
                            (groupItemInfo.standings.map((result) => {
                                if (result.average >= 0) {
                                    counter++;
                                    return (
                                        <div className="item-result" key={counter}>
                                            <p> {counter}.</p>
                                            <p> {result.name} </p>
                                            <p> {result.average} </p>
                                        </div>
                                    );
                                }
                            }))
                            : <p> Nog geen resultaten voor deze groep </p>}
                    </div>
                </div>

                <div>
                    {groupItemInfo.nextMatch ?
                        <p className="match"> Volgende wedstrijd: {groupItemInfo.nextMatch} </p> :
                        <p className="match"> Nog geen wedstrijden gepland.</p>}


                    <a href={link}> Groep bekijken > </a>
                </div>
            </div>
        </React.Fragment>
    )

};

export default GroupItem;