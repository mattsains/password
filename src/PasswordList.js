import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RefreshIndicator from './hacks/BetterRefreshIndicator.js';

import PasswordClient from './services/password-client.js';
import PasswordDetailDialog from './PasswordDetailDialog.js';
import PasswordAddDialog from './PasswordAddDialog.js'

import style from './PasswordList.css';

export default class PasswordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: [],
            currentPassword: undefined,
            loading: true,
            isAddingPassword: false
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
                passwordKey={this.state.currentPassword}
                encryptionKey={this.props.encryptionKey}
            />
        );

        const passwordAddDialog = (
            <PasswordAddDialog
                encryptionKey={this.props.encryptionKey}
                open={this.state.isAddingPassword}
                onDialogClose={() => {
                    this.setState({ isAddingPassword: false });
                    this.componentDidMount();
                }}
            />
        );

        return (
            <div>
                <FloatingActionButton
                    className='addButton'
                    onTouchTap={() => this.setState({isAddingPassword: true})}
                >
                    <Add />
                </FloatingActionButton>
                <Card className='passwordList'>
                    <CardTitle title='Passwords' />
                    {inside}
                    {passwordDetailDialog}
                    {passwordAddDialog}
                </Card>
            </div>
        );
    }

    handlePasswordSelection = passwordKey => {
        this.setState({currentPassword: passwordKey});
    }

    handlePasswordDetailDone = () => {
        this.setState({currentPassword: undefined});
    }

    renderListItems() {
        return Object.entries(this.state.passwords).map(entry => {
            const [key, val] = entry;
            return (
                <span key={key}>
                <ListItem
                    primaryText={val}
                    onTouchTap={() => this.handlePasswordSelection(key)}
                />
                <Divider inset={false}/>
                </span>
            );
        });
    }
}