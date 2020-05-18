import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

export default function ChatMessageInput(props) {
    const [message, setMessage] = useState("");

    const handleOnMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();

        if (props.onSubmit != null) {
            props.onSubmit(message).then(() => {
                setMessage("");
            });
        }
    }

    var disable = !props.isConnected;
    return (
        <Form className="chat-message-input" onSubmit={handleOnSubmit}>
            <Form.Control placeholder={disable ? "Not connected" : "Type your message and press 'Enter' to submit"}
                value={message}
                onChange={handleOnMessageChange}
                disabled={disable} />
        </Form>
    );
}