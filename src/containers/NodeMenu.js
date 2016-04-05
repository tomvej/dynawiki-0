import React from 'react'
import { connect } from 'react-redux'
import { startEditing } from '../actions'

const mapDispatchToProps = dispatch => ({
    startEditing: event => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(startEditing());
    }
});

const Menu = ({startEditing}) => <span id="node-menu">
    <a href="" onClick={startEditing}>Edit</a>
</span>;

export default connect(
    () => ({}),
    mapDispatchToProps
)(Menu)