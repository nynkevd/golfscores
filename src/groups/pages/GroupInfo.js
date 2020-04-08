import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";

import {AuthContext} from "../../shared/auth-context";

const GroupInfo = () => {
    let {groupId} = useParams();
    const auth = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(auth.token);
        (async function loadData() {
            setIsLoading(true);
            await axios({
                method: 'GET',
                url: `${process.env.REACT_APP_API_URL}/group/groupinfo/${groupId}`,
                headers: {
                    'X-Auth-Token': auth.token
                }
            }).then((res) => {
                console.log(res.data);
            })
        })();
        setIsLoading(false);
    }, []);

    return (
        <React.Fragment>

            <h1> {groupId} </h1>

        </React.Fragment>
    )
};

export default GroupInfo;