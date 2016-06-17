import React from 'react'
import { connect } from 'react-redux'

import NodeMenu from './NodeMenu'
import { popup } from '../actions'


const mapStateToProps = state => ({
    visible: !!state.popup
});

const mapDispatchToProps = dispatch => ({
    show: event => {
        dispatch(popup(true));
        event.preventDefault();
        event.stopPropagation();
    }
});

const Anchor = ({visible, show}) =>
    <span id="node-anchor">
        <a href="" onClick={show}>v</a>
        {visible ? <NodeMenu /> : null}
    </span>;

export default connect(mapStateToProps, mapDispatchToProps)(Anchor);