import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    dialog: {
        minWidth: '35vw',
        minHeight: '20vh'
    },
    input: {
        display: 'block'
    }
});

class LoginDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }

    handleDialogClose = () => {
        this.setState({open: false});
    }

    notifyDialogClosed = () => {
        if (this.props.onDialogClose) {
            this.props.onDialogClose(this.state.encryptionKey);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                open={this.state.open}
                onRequestClose={this.handleDialogClose}
                onExited={this.notifyDialogClosed}
            >
                <DialogTitle>Log in</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            onChange={e => this.setState({encryptionKey: e.target.value})}
                            label='Master Password'
                            className={classes.input}
                            autoFocus
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                <Button color='primary' onTouchTap={this.handleDialogClose}>Log in</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LoginDialog);