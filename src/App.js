import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme, withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';
import LockOutline from 'material-ui-icons/LockOutline';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import { blue, orange } from 'material-ui/colors'
import { LinearProgress } from 'material-ui/Progress';

import { BrowserRouter, Link, Route } from 'react-router-dom';

import './App.css';

import PasswordClient from './services/password-client.js';
import PasswordList from './PasswordList.js';
import PasswordAddDialog from './PasswordAddDialog.js'
import PasswordDetailDialog from './PasswordDetailDialog.js'

const muiTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: orange,
        type: 'light'
    }
});

const styles = theme => ({
    addLink: {
        position: 'fixed',
        right: '3em',
        bottom: '3em'
    },
    content: theme.mixins.gutters({
        paddingTop: 80
    })
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            passwords: undefined,
            encryptionKey: 'test'
        };
        this.client = new PasswordClient();
    }

    componentWillMount() {
        this.loadPasswords();
    }

    loadPasswords() {
        this.setState({isLoading: true });
        this.client.listPasswords(this.state.encryptionKey)
            .then(passwords => this.setState({ passwords, isLoading: false }));
    }

    render() {
        const { classes } = this.props;

        const createDetailDialog = ({ match, history }) => (
            <PasswordDetailDialog
                passwordKey={match.params.key}
                encryptionKey={this.state.encryptionKey}
                onDialogClose={() => {
                    history.push('/');
                }}
            />
        );

        const createPasswordAddDialog = ({ match, history }) => (
            <PasswordAddDialog
                encryptionKey={this.state.encryptionKey}
                name='Add Password'
                onDialogClose={(entry) => {
                    this.setState({ 
                        passwords: {
                            ...this.state.passwords,
                            [entry.key]: entry.name
                        }
                    });
                    history.push('/');
                }}
            />
        );

        return (
            <MuiThemeProvider theme={muiTheme}>
                <BrowserRouter>
                    <main>
                        <AppBar position='fixed'>
                            <Toolbar>
                                <IconButton color='contrast'><LockOutline/></IconButton>
                                <Typography type='title' color='inherit'>Passwords</Typography>
                            </Toolbar>
                            {this.state.isLoading ? <LinearProgress color='accent' style={{height:3}} /> : false}
                        </AppBar>
                        <section className={classes.content}>
                            <PasswordList 
                                isLoading={this.state.isLoading}
                                passwords={this.state.passwords} 
                            />
                        </section>
                        <Link to='/password/add' className={classes.addLink}>
                            <Button fab color='primary' className={classes.addButton}><Add /></Button>
                        </Link>
                        <Route path='/password/:key(.*-.*)' render={createDetailDialog} />
                        <Route path='/password/add' render={createPasswordAddDialog} />
                    </main>
                </BrowserRouter>
            </MuiThemeProvider>
        );
    }
}
export default withStyles(styles)(App);