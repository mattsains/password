import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import PasswordClient from './services/password-client.js';

import RefreshIndicator from './hacks/BetterRefreshIndicator.js';

import style from './PasswordList.css';

export default class PasswordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: [],
            loading: true
        };
    }

    componentDidMount() {
        const client = new PasswordClient();
        client.listPasswords(this.props.encryptionKey).then(passwords => {
            this.setState({passwords, loading: false})})
            .catch(err => {
                console.error(err);});
    }

    render() {
        let inside;
        if (this.state.loading) inside = <RefreshIndicator size={40} className='refresh' status='loading' />;
        else inside = <List>{this.renderListItems()}</List>;

        return (
            <div>
                <FloatingActionButton className='addButton'>
                    <Add />
                </FloatingActionButton>
                <Card className='passwordList'>
                    <CardTitle title='Passwords' />
                    {inside}
                </Card>
            </div>
        );
    }

    renderListItems() {
        return this.state.passwords.map(item => (
            <span key={item}>
            <ListItem
                primaryText={item}
            />
            <Divider inset={false}/>
            </span>
        ));
    }
}