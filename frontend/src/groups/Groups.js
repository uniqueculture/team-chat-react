import './Groups.css';
import React, { useState, useEffect } from 'react';
import Avatar from '../utils/Avatar';
import { getAbbreviation } from '../utils/Utils';
import { Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Groups(props) {
    if (typeof (props.groups) === "undefined") {
        throw new Error("Groups property is expected. Listen to onLoad event");
    }

    const groups = props.groups;

    const placement = "right";
    var items = groups.map((group) => {
        return <OverlayTrigger
            key={group.getUri()}
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${placement}`}>{group.name}</Tooltip>
            }>
            <Link to={"/group/" + group.slug}>
                <GroupItem group={group}></GroupItem>
            </Link>
        </OverlayTrigger>

    });

    return <div className="chat-groups">
        {items}
    </div>

}

export class GroupItem extends React.Component {
    constructor(props) {
        super(props);

        this.group = props.group;
    }

    render() {
        return <div className="chat-group">
            <Avatar size="60">{getAbbreviation(this.group.name)}</Avatar>
        </div>
    }
}