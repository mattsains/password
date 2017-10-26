import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import PasswordClient from './services/password-client.js';

const styles = theme => ({
    dialog: {
        minWidth: '35vw',
        minHeight: '20vh'
    },
    input: {
        display: 'block'
    }
});

class PasswordAddDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: true
        };
    }

    componentDidMount() {
        this.client = new PasswordClient();
    }

    handleDialogClose = () => {
        this.setState({open: false, loading: false});
    }

    notifyDialogClosed = () => {
        if (this.props.onDialogClose) {
            this.props.onDialogClose({
                key: this.state.key,
                name: this.state.name
            });
        }
    }

    savePassword = () => {
        this.setState({loading: true});
        this.client.putPassword(this.state.name, this.state.password, this.props.encryptionKey)
            .then(key => this.setState({ key }))
            .then(() => this.handleDialogClose());
    }

    render() {
        const { classes } = this.props;

        let content;
        if (this.state.loading) {
            content = (
                <CircularProgress size={40} className='refresh' status='loading' />
            );
        } else {
            content = (
                <form>
                    <TextField
                        onChange={e => this.setState({name: e.target.value})}
                        label='Name'
                        className={classes.input}
                        autoFocus
                    />
                    <TextField
                        onChange={e => this.setState({password: e.target.value})}
                        label='Password'
                        className={classes.input}
                    />
                </form>
            );
        }

        return (
            <Dialog
                title={this.props.name}
                open={this.state.open}
                onRequestClose={this.handleDialogClose}
                onExited={this.notifyDialogClosed}
            >
                <DialogTitle>{this.props.name}</DialogTitle>
                <DialogContent>{content}</DialogContent>
                <DialogActions>
                <Button onTouchTap={this.handleDialogClose}>Cancel</Button>
                <Button color='primary' onTouchTap={this.savePassword}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(PasswordAddDialog);