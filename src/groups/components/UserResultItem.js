import React, {useState, useEffect} from 'react';
import './UserResultItem.css';

const UserResultItem = props => {

    let found = false;

    const [invited, setInvited] = useState(found);

    useEffect(() => {
        found = props.invitedPlayers.some(invite => invite.userId === props.userId);
        setInvited(found);
    }, [props.invitedPlayers]);

    const addUser = () => {
        props.addUser(props.userId);
        if (!found) {
            props.setInvitedPlayers([
                ...props.invitedPlayers,
                {
                    userId: props.userId,
                    name: props.name
                }
            ]);
            setInvited(true);
        }
    };

    return (
        <li className="userResultItem card">
            <div>
                <h3> {props.name} </h3>
                <p> {props.username} </p>
                <p> {props.description} </p>
            </div>

            <button type="button" className={invited ? "secondary" : ""} disabled={invited}
                    onClick={addUser}> {invited ? "UITGENODIGD" : "UITNODIGEN"} </button>
        </li>
    )

};

export default UserResultItem;

