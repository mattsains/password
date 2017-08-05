import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import IconButton from 'material-ui/IconButton';
import PasswordClient from './services/password-client.js';

import './App.css';

import Login from './Login.js';
import PasswordList from './PasswordList.js';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: []
        };
    }

    componentDidMount() {
        const client = new PasswordClient();
        client.listPasswords('test').then(passwords => this.setState({passwords}));
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar 
                        title="Password Manager"
                        iconElementLeft={<IconButton><LockOutline/></IconButton>}
                     />
                    <PasswordList 
                        passwords={this.state.passwords}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}