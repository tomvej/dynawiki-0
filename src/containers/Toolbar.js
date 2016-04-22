import React from 'react'
import { connect } from 'react-redux'

import { undo, redo } from '../actions'

const mapStateToProps = state => ({
    canUndo: state.versions.undo.length > 0 && state.editor === null,
    canRedo: state.versions.redo.length > 0 && state.editor === null
});

const catchEvent = (dispatch, generator) => event => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(generator(event));
};

const mapDispatchToProps = dispatch => ({
    undo: catchEvent(dispatch, undo),
    redo: catchEvent(dispatch, redo)
});

const Toolbar = ({canUndo, canRedo, undo, redo, nothing}) => <div id="toolbar">
    {canUndo ? <a href="" id="undo" onClick={undo}>Undo</a> : null}
    {canRedo ? <a href="" id="redo" onClick={redo}>Redo</a> : null}
</div>;

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);