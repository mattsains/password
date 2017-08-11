import React, { Component } from 'react';
import _RefreshIndicator from 'material-ui/RefreshIndicator';

export default class BetterRefreshIndicator extends Component {
    constructor(...params) {
        super(...params);
    }

    render() {
        const style = {
            transform: 'none',
            position: 'static'
        };
        return (
            <_RefreshIndicator {...this.props} style={style} top={0} left={0} />
        );
    }
}