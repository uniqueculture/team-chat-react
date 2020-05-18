import React from 'react';
import './PanelHeader.css';

export default function PanelHeader(props) {

    var header;
    if (props.title != null) {
        header = props.title;
    } else {
        header = props.children;
    }

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="navbar-brand" href="#">{header}</div>
            {props.children}
        </nav>
    );
}