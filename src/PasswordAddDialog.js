import React, { Component } from 'react';
import RefreshIndicator from './hacks/BetterRefreshIndicator.js';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import PasswordClient from './services/password-client.js';

import style from './PasswordAddDialog.css';

export default class PasswordAddDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: false
        };
    }

    componentDidMount() {
        this.client = new PasswordClient();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.open !== this.state.open) {
            this.setState({ open: newProps.open });
            if (newProps.open == false && this.props.open == true) this.props.onDialogClose();
        }
    }

    handleDialogClose = () => {
        this.setState({open: false, loading: false});
        if (this.props.onDialogClose) this.props.onDialogClose();
    }

    savePassword = () => {
        this.setState({loading: true});
        this.client.putPassword(this.state.name, this.state.password, this.props.encryptionKey)
            .then(() => this.handleDialogClose());
    }

    render() {
        const actions = [
            <FlatButton
                label='Save'
                primary={true}
                onTouchTap={this.savePassword}
            />,
            <FlatButton
                label='Cancel'
                primary={false}
                onTouchTap={this.handleDialogClose}
            />
        ];

        let content;
        if (this.state.loading) {
            content = (
                <RefreshIndicator size={40} className='refresh' status='loading' />
            );
        } else {
            content = (
                <form>
                    <TextField
                        onChange={(e, val) => this.setState({name: val})}
                        hintText='Name'
                        className='input-field'
                    />
                    <TextField
                        onChange={(e, val) => this.setState({password: val})}
                        hintText='Password'
                        className='input-field'
                    />
                </form>
            );
        }

        return (
            <Dialog
                title={this.props.name}
                modal={false}
                actions={actions}
                open={this.state.open}
                onRequestClose={this.handleDialogClose}
            >
                {content}
            </Dialog>
        );
    }
}
