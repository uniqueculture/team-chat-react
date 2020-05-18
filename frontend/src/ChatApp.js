import React, { useState, useEffect, useContext } from 'react';
import { useConnectionStatus, useUserGroups, findGroupBySlug } from './utils/Utils';
import { DataService } from './data/DataService';
import { MessagingService } from './data/MessagingService';
import { LightningFill, Lightning, HouseFill, Plus, Power } from 'react-bootstrap-icons';
import Avatar from './utils/Avatar';
import Groups from './groups/Groups';
import OpenGroups from './groups/OpenGroups';
import GroupModal from './groups/GroupModal';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import ChatGroup from './ChatGroup';
import { Spinner } from 'react-bootstrap';
import { UserContext } from './App';


export default function ChatApp(props) {

    const userContext = useContext(UserContext);
    const user = userContext.user;
    const { userGroups, isLoading, refresh: refreshUserGroups } = useUserGroups(user);

    useEffect(() => {
        // Connect to the Message server
        MessagingService.connect();
    }, []);

    // Groups are being loaded
    if (isLoading) {
        return <Spinner className="loading" animation="grow" />;
    }

    // Convert userGroups to list of groups
    const groups = userGroups.map(ug => ug.group);

    // Render
    const groupsPanel = <ChatAppGroupsPanel
        groups={groups}
        user={user}
        onNewGroup={refreshUserGroups}
        onLogout={userContext.logout}>
    </ChatAppGroupsPanel>
    console.log("Render ChatApp");
    return (
        <React.Fragment>
            <Switch>
                <Route path="/group/:group">
                    {groupsPanel}
                    <ChatGroup groups={groups} user={user}></ChatGroup>
                </Route>
                <Route path="/">
                    {groupsPanel}
                    <div className="col-md-2 app-chats">
                        <div>DMs</div>
                    </div>
                    <div className="app-chat">
                        <div>
                            <OpenGroups user={user} onGroupJoin={refreshUserGroups}></OpenGroups>
                        </div>
                    </div>
                    <div className="col-md-2 app-users">
                        <div>Friends</div>
                    </div>
                </Route>
            </Switch>
        </React.Fragment>
    );
}

function ChatAppGroupsPanel(props) {
    const isConnected = useConnectionStatus();
    const [showGroupModal, setShowGroupModal] = useState(false);

    let { group: groupSlug } = useParams();
    let selectedGroup = findGroupBySlug(props.groups, groupSlug);

    const toggleConnection = (event) => {
        event.preventDefault();

        if (isConnected) {
            MessagingService.disconnect();
        } else {
            MessagingService.connect();
        }
    }

    const onShowGroupModal = (event) => {
        event.preventDefault();

        console.log("Showing...");
        setShowGroupModal(true);
    }

    const onSubmitGroupModal = (values) => {
        var group = DataService.createGroup(values);
        group.addUser(props.user, "OWNER");
        group.save().then((success) => {
            // Group saved, associate current user as owner
            props.onNewGroup(group);
            // Close the modal window
            setShowGroupModal(false);
        });
    }


    var connectIcon = isConnected ?
        <LightningFill size="24"></LightningFill> :
        <Lightning size="24"></Lightning>;

    // Render
    return <div className="col-md-1 app-groups bg-light">
        <div>
            <Link to="/">
                <Avatar size="60">
                    <HouseFill size="24"></HouseFill>
                </Avatar>
            </Link>
        </div>
        <hr />
        <Groups groups={props.groups}></Groups>
        <div>
            <button className="btn btn-link" onClick={onShowGroupModal}>
                <Avatar size="60">
                    <Plus size="24"></Plus>
                </Avatar>
            </button>
        </div>
        <div className="spacer"></div>
        <div>
            <button className="btn btn-link" onClick={toggleConnection}>
                <Avatar size="60">
                    {connectIcon}
                </Avatar>
            </button>
        </div>
        <div>
            <button className="btn btn-link">
                <Avatar size="60">
                    <Power size="24" onClick={props.onLogout}></Power>
                </Avatar>
            </button>
        </div>
        <GroupModal show={showGroupModal} onSubmit={onSubmitGroupModal} onClose={() => setShowGroupModal(false)}></GroupModal>
    </div>

}