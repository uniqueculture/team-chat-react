import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ChatModal(props) {

    const show = props.show;
    const handleClose = props.onClose;

    const handleOnSubmit = (event) => {
        event.preventDefault();

        // Get form values
        var elements = event.target.elements;
        var obj = {};
        for (var i = 0; i < elements.length; i++) {
            var item = elements.item(i);
            if (item.name.length === 0)  {
                continue;
            }

            obj[item.name] = item.value;
        }

        if (props.onSubmit != null) {
            var p = props.onSubmit(obj);
            // If callback returns a promise, listen for it and reset the form
            if (p != null) {
                p.then(() => {
                    event.target.reset();
                });
            }
        }
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose} animation={false} centered>
            <Form onSubmit={handleOnSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>New chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter group name" name="name" />
                        <Form.Text className="text-muted">
                            Only spaces are allowed.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}