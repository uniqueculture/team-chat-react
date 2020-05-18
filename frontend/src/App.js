import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Switch, Link, Redirect, useHistory } from 'react-router-dom';
import Login from './login/Login';
import { DataService } from './data/DataService';
import ChatApp from './ChatApp';

export const UserContext = React.createContext({
    user: null,
    isLoggedIn: false,
    login: () => {},
    logout: () => {}
});

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    let history = useHistory();

    const handleOnLogin = (token) => {
        // Set state
        setIsLoggedIn(true);
        // Redirect to home page
        history.replace("/");
    }

    const handleOnLogout = (event) => {
        event.preventDefault();
        // Logout
        DataService.logout();
        // Set state
        setIsLoggedIn(false);

        // Redirect
        history.replace("/login");
    }

    useEffect(() => {
        // Attemp to login if the token is stored locally
        DataService.tryAuthenticate().then((isSuccessful) => {
            if (isSuccessful) {
                console.log("Logged in...");
                setIsLoggedIn(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }).catch((error) => {
            // Eat it
        });
    }, []);

    // Render
    var app;
    if (isLoading) {
        // Loading user information
        app = <div>Loading</div>;
    } else if (isLoggedIn) {
        // Get current user
        var currentUser = DataService.getCurrentUser();
        var contextValue = {
            user: currentUser,
            isLoggedIn: isLoggedIn,
            login: handleOnLogin,
            logout: handleOnLogout,
        }

        app = <UserContext.Provider value={contextValue}>
            <ChatApp></ChatApp>
        </UserContext.Provider>;
    } else {
        // Redirect to login page
        app = <Redirect to="/login"></Redirect>
    }

    return (
        <div className="app-container">
            <div className="container-fluid">
                <Switch>
                    <Route path="/login">
                        <div className="row no-gutters justify-content-center align-items-center">
                            <div className="col-md-4">
                                <Login onLogin={handleOnLogin}></Login>
                            </div>
                        </div>
                    </Route>
                    <Route>
                        <div className="row no-gutters">
                            {app}
                        </div>
                    </Route>
                </Switch>
            </div>
        </div >
    );
}


export default App;
