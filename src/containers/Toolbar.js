import React from 'react'
import { connect } from 'react-redux'

import { undo, redo } from '../actions'

const mapStateToProps = state => ({
    canUndo: state.versions.undo.length > 0,
    canRedo: state.versions.redo.length > 0
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

const Toolbar = ({canUndo, canRedo, undo, redo}) => <div id="#toolbar">
    {canUndo ? <a href="" onClick={undo}>Undo</a> : null}
    {canRedo ? <a href="" onClick={redo}>Redo</a> : null}
</div>;

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);