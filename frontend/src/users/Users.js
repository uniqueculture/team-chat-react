import React, { useState, useEffect, } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Avatar from '../utils/Avatar';
import { getAbbreviation } from '../utils/Utils';
import './Users.css';


function Users(props) {
    const group = props.group;
    const [groupUsers, setGroupUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        group.getGroupUsers().then((groupUsers) => {
            setGroupUsers(groupUsers);
            setIsLoading(false);
        });
    }, [group]);

    // Render
    if (isLoading) {
        return <Spinner className="loading" animation="grow" />;
    }

    var online = groupUsers.filter(gu => gu.user.status !== "offline").map(gu => gu.user);
    var offline = groupUsers.filter(gu => gu.user.status === "offline").map(gu => gu.user);
    return (
        <div className="users">
            <UserGroup users={online}></UserGroup>
            <UserGroup users={offline} header="Offline"></UserGroup>
        </div>
    );
}

function UserGroup(props) {
    if (props.users.length === 0) {
        return (null);
    }

    var header = typeof (props.header) !== "undefined" ?
        <h6>{props.header}</h6> : (null);
    var items = props.users.map((user) => <UserItem key={user.getUri()} user={user}></UserItem>);
    return (
        <React.Fragment>
            {header}
            {items}
        </React.Fragment>
    );
}


function UserItem(props) {
    return (
        <div>
            <Avatar size="50">{getAbbreviation(props.user.displayName)}</Avatar>
            <div className="user-info">{props.user.displayName}<br /><span>{props.user.status}</span></div>
        </div>
    );
}

export default Users;