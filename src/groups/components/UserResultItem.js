import React, {useState} from 'react';

const UserResultItem = props => {

    const [invited, setInvited] = useState(props.invited);

    const addUser = () => {
        props.addUser(props.userId);
        setInvited(true);
    };

    return (
        <li className="">
            <h1> {props.name} </h1>
            <h2> {props.username} </h2>
            <p> {props.description} </p>
            <button type="button" className={invited ? "inverse" : undefined} disabled={invited}
                    onClick={addUser}> {invited ? "UITGENODIGD" : "UITNODIGEN"} </button>
        </li>
    )

};

export default UserResultItem;

