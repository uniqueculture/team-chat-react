import React, { useState, useEffect } from 'react';
import { Spinner, ListGroup } from 'react-bootstrap';
import { DataService } from '../data/DataService';
import PanelHeader from '../utils/PanelHeader';
import './OpenGroups.css';


export default function OpenGroups(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        DataService.getGroups().then((groups) => {
            setGroups(groups);
            setIsLoading(false);
        });
    }, []);

    const joinGroup = (group) => {
        group.addUser(props.user, "USER");
        group.save().then(() => {
            props.onGroupJoin(group);
        });
    }

    if (isLoading) {
        return <Spinner animation="grow"></Spinner>
    }

    var items = groups.map((group) => {
        return <ListGroup.Item action onClick={() => joinGroup(group)} key={group.getUri()}>{group.name}</ListGroup.Item>
    });

    return <div>
        <PanelHeader title="Join a group"></PanelHeader>
        <div className="open-groups">
            <ListGroup variant="flush">{items}</ListGroup>
        </div>
    </div>
}