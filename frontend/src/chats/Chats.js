import React, { useState, useEffect } from 'react';
import PanelHeader from '../utils/PanelHeader';
import Spinner from 'react-bootstrap/Spinner';
import './Chats.css';
import { useParams, Link } from 'react-router-dom';
import { GearFill } from 'react-bootstrap-icons';
import { Dropdown } from 'react-bootstrap';
import ChatModal from '../chat/ChatModal';
import { DataService } from '../data/DataService';

export default function Chats(props) {
    if (typeof (props.group) === "undefined") {
        throw new Error("Group property is required");
    }

    if (typeof (props.chats) === "undefined") {
        throw new Error("Chats property is required. Listen to onLoad");
    }

    const group = props.group;
    const chats = props.chats;
    const [showChatModal, setShowChatModal] = useState(false);

    let { group: groupSlug, chat: chatSlug } = useParams();

    const handleOnSubmit = (values) => {
        const chat = DataService.createChat(group, values);
        chat.save().then((success) => {
            // Reload chats list
            setShowChatModal(false);
            console.log("Loading chats for group", group.name);
            group.getChats().then((chats) => {
                console.log("Loaded", chats.length, "chats");

                props.onLoad(chats);

                /*if (chats.length > 0) {
                    // Redirect to the first chat
                    // Later may implement a cookie
                    // Also, still no redirect if just the group is clicked
                    history.replace(match.url + "/chat/" + slugify(chats[0].name).toLowerCase());
                }*/
            });
        });
    }

    const handleOnLeaveGroup = () => {
        
    }

    // !!! the STATE of the variables might be old, since the component is re-rendered and state is not reset!!!

    var items = chats.map((chat) => {
        var className = chat.slug === chatSlug ? "active" : "";
        return (
            <li className="nav-item" key={chat.getUri()}>
                <Link to={"/group/" + groupSlug + "/chat/" + chat.slug} className={"nav-link " + className}>
                    {chat.name}
                </Link>
            </li>
        );
    });

    return (
        <div className="chats-container">
            <PanelHeader title={group.name}>
                <Dropdown>
                    <Dropdown.Toggle size="sm" variant="link" id="dropdown-basic">
                        <GearFill></GearFill>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowChatModal(true)}>New channel</Dropdown.Item>
                        <Dropdown.Item onClick={props.onLeaveGroup}>Leave group</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#/action-3">Delete group</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </PanelHeader>
            <ul className="nav nav-pills flex-column">
                {items}
            </ul>
            <ChatModal show={showChatModal} onClose={() => setShowChatModal(false)} onSubmit={handleOnSubmit}></ChatModal>
        </div>
    );
}