import React, {useContext, useEffect, useState} from 'react';

import axios from "axios";

import "./GroupItem.css";

import {AuthContext} from "../../shared/auth-context";

const GroupItem = props => {
    const auth = useContext(AuthContext);
    const [groupItemInfo, setGroupItemInfo] = useState({
        groupName: '',
        groupId: props.groupId,
        first: {}, second: {}, third: {}
    });
    let link = `/groupinfo/${props.groupId}`;

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
                    first: res.data.first,
                    second: res.data.second,
                    third: res.data.third
                });

            })
        })();
    }, []);

    return (
        <React.Fragment>
            <div className="groupItem">
                <p><strong> {groupItemInfo.groupName} </strong></p>

                <p> 1. {groupItemInfo.first.player} {groupItemInfo.first.score} </p>
                <p> 2. {groupItemInfo.second.player} {groupItemInfo.second.score} </p>
                <p> 3. {groupItemInfo.third.player} {groupItemInfo.third.score} </p>

                <a href={link}> Groep bekijken > </a>
            </div>
        </React.Fragment>
    )

};

export default GroupItem;