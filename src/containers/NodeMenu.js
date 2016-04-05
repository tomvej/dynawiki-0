import React from 'react'
import { connect } from 'react-redux'
import { startEditing, appendEditor } from '../actions'

const mapDispatchToProps = dispatch => ({
    startEditing: event => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(startEditing());
    },
    appendEditor: event => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(appendEditor());
    }
});

const Menu = ({startEditing, appendEditor}) => <span id="node-menu">
    <a href="" onClick={appendEditor}>Append</a>
    <a href="" onClick={startEditing}>Edit</a>
</span>;

export default connect(
    () => ({}),
    mapDispatchToProps
)(Menu)