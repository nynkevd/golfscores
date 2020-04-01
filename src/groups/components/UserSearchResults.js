import React from 'react';

import UserResultItem from "./UserResultItem";

const UserSearchResults = props => {
    return (
        <ul className="users-list">
            {props.items.map(user =>
                <UserResultItem addUser={props.addUser} userId={user.userId} key={user.userId} name={user.name}
                                username={user.username} description={user.description} invited={false}/>
            )}
        </ul>
    )
};

export default UserSearchResults;