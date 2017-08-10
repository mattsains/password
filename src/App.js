import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import IconButton from 'material-ui/IconButton';

import './App.css';

import Login from './Login.js';
import PasswordList from './PasswordList.js';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title='Password Manager'
                        iconElementLeft={<IconButton><LockOutline/></IconButton>}
                     />
                    <PasswordList
                        encryptionKey='test'
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}