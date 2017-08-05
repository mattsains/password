import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import './PasswordList.css';

export default class PasswordList extends Component {
    render() {
        return (
            <div>
                {this.renderAddButton()}
                <Card className="passwordList">
                    <CardTitle title="Passwords" />
                    <List>{this.renderListItems()}</List>
                </Card>
            </div>
        );
    }

    renderListItems() {
        return this.props.passwords.map(item => (
            <span>
            <ListItem
                primaryText={item}
            />
            <Divider inset={false}/>
            </span>
        ));
    }

    renderAddButton() {
        return (
            <FloatingActionButton className="addButton">
                <Add />
            </FloatingActionButton>
        );
    }
}