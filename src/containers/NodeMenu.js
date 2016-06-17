import React from 'react'

import { connect } from 'react-redux'
import { startEditing, appendEditor, startRenaming, deleteSelection, popup } from '../actions'
import Menu from '../components/PopupMenu'

const mapStateToProps = state => ({
    onSection: state.selection.index === null
});

const catchAction = (dispatch, generator) => event => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(popup(false));
    dispatch(generator(event));
};

const mapDispatchToProps = dispatch => ({
    startEditing: catchAction(dispatch, startEditing),
    appendEditor: catchAction(dispatch, appendEditor),
    startRenaming: catchAction(dispatch, startRenaming),
    deleteSelection: catchAction(dispatch, deleteSelection),
    hide: () => {dispatch(popup(false));}
});


const ActionProvider = ({onSection, startEditing, appendEditor, startRenaming, deleteSelection, hide}) => {
    const actions = [
        ['Append', appendEditor],
        ['Edit', startEditing],
        onSection && ['Rename', startRenaming],
        ['Delete', deleteSelection]
    ].filter(a => !!a).map(([name, action]) => ({name, action}));
    return <Menu actions={actions} hide={hide}/>;
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActionProvider);