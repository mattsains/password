import React, { Component } from 'react';
import _RefreshIndicator from 'material-ui/RefreshIndicator';

export default class BetterRefreshIndicator extends Component {
    constructor(...params) {
        super(...params);
    }

    componentWillMount() {
        const style = {
            transform: 'none',
            left: 0,
            top: 0,
            position: 'static'
        };
        this.indicator = (
            <_RefreshIndicator {...this.props} style={style} />
        );
    }

    render() {
        return this.indicator;
    }
}