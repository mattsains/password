import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogTitle, DialogContent } from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress'
import { withStyles } from 'material-ui/styles';

import PasswordClient from './services/password-client.js';

const styles = theme => ({
    dialog: {
        minWidth: '25vw',
        minHeight: '10vh'
    }
});

class PasswordDetailDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            name: undefined,
            password: undefined,
            open: true
        };
    }

    componentDidMount() {
        this.client = new PasswordClient();
        this.client.getPassword(this.props.passwordKey, this.props.encryptionKey)
        .then(entry => {
            this.setState({
                name: entry.name,
                password: entry.password,
                loading: false
            });
        })
        .catch(err => console.error(err));
    }

    handleDialogClose() {
        this.setState({ open: false }); 
    }

    render() {
        const { classes } = this.props;

        let content;
        if (this.state.loading) {
            content = (
                <CircularProgress size={40} className='refresh' status='loading' />
            );
        } else {
            content = (<span>{this.state.password}</span>);
        }

        return (
            <Dialog
                open={this.state.open}
                onRequestClose={() => this.handleDialogClose()}
                onExited={this.props.onDialogClose}
            >
                <DialogTitle>{this.state.name || this.props.name}</DialogTitle>
                <DialogContent className={classes.dialog}>{content}</DialogContent>
                <DialogActions>
                    <Button onTouchTap={() => this.handleDialogClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(PasswordDetailDialog);