import React from 'react';

import './UserSearchResults.css';
import UserResultItem from "./UserResultItem";

const UserSearchResults = props => {
    return (
        <ul className="users-list grid">
            {props.items.map(user =>
                <UserResultItem invitedPlayers={props.invitedPlayers} setInvitedPlayers={props.setInvitedPlayers}
                                addUser={props.addUser} userId={user.userId} key={user.userId} name={user.name}
                                username={user.username} description={user.description}/>
            )}
        </ul>
    )
};

export default UserSearchResults;