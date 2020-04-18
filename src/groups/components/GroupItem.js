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
                    standings: res.data.standings
                });

            })
        })();
    }, []);

    return (
        <React.Fragment>
            <div className="groupItem">
                <p><strong> {groupItemInfo.groupName} </strong></p>

                {groupItemInfo.standings.length > 0 ?
                    (groupItemInfo.standings.map((result) => {
                        if (result.average) {
                            counter++;
                            return (
                                <React.Fragment key={counter}>
                                    <p> {counter}.</p>
                                    <p> {result.name} </p>
                                    <p> {result.average} </p>
                                </React.Fragment>
                            );
                        }
                    }))
                    : <p> Nog geen resultaten voor deze groep </p>}

                {counter === 0 ? <p> Nog geen resultaten voor deze groep </p> : null}


                <a href={link}> Groep bekijken > </a>
            </div>
        </React.Fragment>
    )

};

export default GroupItem;