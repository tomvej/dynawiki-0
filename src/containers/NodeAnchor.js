import React from 'react'
import { connect } from 'react-redux'

import NodeMenu from './NodeMenu'


const mapStateToProps = state => ({
    visible: !!state.popup
});

const mapDispatchToProps = state => ({
    show: event => {
        event.preventDefault();
    }
});

const Anchor = ({visible, show}) =>
    <span id="node-anchor">
        <a href="" onClick={show}>v</a>
        {visible ? <NodeMenu /> : null}
    </span>;

export default connect(mapStateToProps, mapDispatchToProps)(Anchor);