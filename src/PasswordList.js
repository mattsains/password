import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RefreshIndicator from './hacks/BetterRefreshIndicator.js';

import PasswordClient from './services/password-client.js';
import PasswordDetailDialog from './PasswordDetailDialog.js';

import style from './PasswordList.css';

export default class PasswordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: [],
            currentPassword: undefined,
            loading: true
        };
    }

    componentDidMount() {
        const client = new PasswordClient();
        client.listPasswords(this.props.encryptionKey)
            .then(passwords => this.setState({passwords, loading: false}))
            .catch(err => console.error(err));
    }

    render() {
        let inside;
        if (this.state.loading) inside = <RefreshIndicator size={40} className='refresh' status='loading' />;
        else inside = <List>{this.renderListItems()}</List>;

        const passwordDetailDialog = (
            <PasswordDetailDialog
                open={!!this.state.currentPassword}
                name={this.state.currentPassword}
                encryptionKey={this.props.encryptionKey}
            />
        );
        return (
            <div>
                <FloatingActionButton className='addButton'>
                    <Add />
                </FloatingActionButton>
                <Card className='passwordList'>
                    <CardTitle title='Passwords' />
                    {inside}
                    {passwordDetailDialog}
                </Card>
            </div>
        );
    }

    handleDialogOpen = passwordName => {
        this.setState({currentPassword: passwordName});
    }

    handleDialogClose = () => {
        this.setState({currentPassword: undefined});
    }

    renderListItems() {
        return this.state.passwords.map(item => (
            <span key={item}>
            <ListItem
                primaryText={item}
                onTouchTap={() => this.handleDialogOpen(item)}
            />
            <Divider inset={false}/>
            </span>
        ));
    }
}