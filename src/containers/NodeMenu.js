import React from 'react'
import { connect } from 'react-redux'
import { startEditing, appendEditor, startRenaming, deleteSelection } from '../actions'

const mapStateToProps = state => ({
    onSection: state.selection.index === null
});

const catchAction = (dispatch, generator) => event => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(generator(event));
};

const mapDispatchToProps = dispatch => ({
    startEditing: catchAction(dispatch, startEditing),
    appendEditor: catchAction(dispatch, appendEditor),
    startRenaming: catchAction(dispatch, startRenaming),
    deleteSelection: catchAction(dispatch, deleteSelection)
});

const Menu = ({startEditing, appendEditor, startRenaming, onSection, deleteSelection}) =>
    <span id="node-menu">
        <a href="" onClick={appendEditor}>Append</a>
        <a href="" onClick={startEditing}>Edit</a>
        {onSection ? <a href="" onClick={startRenaming}>Rename</a> : null}
        <a href="" onClick={deleteSelection}>Delete</a>
    </span>;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)