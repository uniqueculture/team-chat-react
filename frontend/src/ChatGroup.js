import React, { useState } from 'react';
import { useRouteMatch, Route, Switch, useParams, useHistory } from 'react-router-dom';
import Chats from './chats/Chats';
import Chat from './chat/Chat';
import Users from './users/Users';
import { findGroupBySlug, useGroupChats } from './utils/Utils';
import { Spinner } from 'react-bootstrap';


export default function ChatGroup(props) {
    // Required props: user, groups

    const user = props.user;
    const groups = props.groups;

    let { group: groupSlug } = useParams();
    let match = useRouteMatch();
    let history = useHistory();

    // Find the request group
    let group = findGroupBySlug(groups, groupSlug);
    if (group === null) {
        throw new Error("Requested group does not exist");
    }

    // Load the chats in the group
    const { chats, isLoading, refresh: refreshChats } = useGroupChats(group);

    const handleOnLeaveGroup = () => {
        // User is leaving the group
        group.removeUser(user);
        group.save().then(() => {
            // Redirect to home
            history.replace("/");
        });
    };

    console.log("Render ChatGroup", isLoading);
    if (isLoading) {
        return <Spinner className="loading" animation="grow" />;
    }
    
    // Render
    return (
        <Switch>
            <Route path={match.path + "/chat/:chat"}>
                <div className="col-md-2 app-chats bg-light">
                    <Chats group={group} chats={chats} onLeaveGroup={handleOnLeaveGroup}></Chats>
                </div>
                <div className="app-chat">
                    <Chat chats={chats}></Chat>
                </div>
                <div className="col-md-2 app-users bg-light">
                    <Users group={group}></Users>
                </div>
            </Route>
            <Route path={match.path}>
                <div className="col-md-2 app-chats bg-light">
                    <Chats group={group} chats={chats} onLeaveGroup={handleOnLeaveGroup}></Chats>
                </div>
                <div className="app-chat"></div>
                <div className="col-md-2 app-users bg-light">
                    <Users group={group}></Users>
                </div>
            </Route>
        </Switch>
    );
}