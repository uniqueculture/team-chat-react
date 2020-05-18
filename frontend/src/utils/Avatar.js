import React from 'react';
import './Avatar.css';


class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.size = props.size;
    }

    render() {
        return (
            <div className="avatar rounded-circle" style={{ width: this.size + "px", height: this.size + "px" }}>
                {this.props.children}
            </div>
        );
    }
}

export default Avatar;