import React, { useState } from 'react';
import './Login.css';
import { DataService } from '../data/DataService';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = (event) => {
        event.preventDefault();

        setIsLoading(true);
        DataService.authenticate(username, password).then((token) => {
            setIsLoading(false);
            if (props.onLogin != null) {
                props.onLogin(token);
            }
        }).catch((error) => {
            setIsLoading(false);
        });
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    var btn = !isLoading ? 
        <button type="submit" className="btn btn-primary">Login</button> : 
        <button type="button" className="btn btn-primary" disabled>Please wait</button>;

    return <div className="card">
        <form onSubmit={handleOnSubmit}>
            <div className="card-body">
                <h5 className="card-title">Team Chat</h5>
                <h6 className="card-subtitle mb-2 text-muted">Welcome, please login.</h6>
                {/*<p className="card-text">Welcome to Team Chat</p>*/}
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleUsernameChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={handlePasswordChange} />
                </div>
                {btn}
            </div>
        </form>
    </div>;
} 