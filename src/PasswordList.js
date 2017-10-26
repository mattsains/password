import React, { Component } from 'react';
import Card, { CardHeader } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid'
import { Link } from 'react-router-dom';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, auto))'
    }),
    link: {
        textDecoration: 'none',
        outline: 0
    }
})

class PasswordList extends Component {
    render() {
        const { classes } = this.props;
        
        return (
            <Grid container className={classes.root}>
                {this.renderListItems()}
            </Grid>
        );
    }

    renderListItems() {
        const { classes, passwords } = this.props;

        if (!passwords) return false;

        return Object.entries(passwords).map(entry => {
            const [key, val] = entry;
            return (
                <Grid item className={classes.gridItem} key={key}>
                    <Link to={`/password/${key}`} className={classes.link}>
                        <Card className={classes.card}><CardHeader title={val} /></Card>
                    </Link>
                </Grid>
            );
        });
    }
}

export default withStyles(styles)(PasswordList);