import update from './utils/update'
import merge from './utils/mergeImmutable'

import Actions from '../actions/constants'
import closeEditor from './closeEditor'
import publish from './publish'
import changeSelection from './changeSelection'
import startEditing from './startEditing'
import appendEditor from './appendEditor'
import startRenaming from './startRenaming'
import rename from './rename'
import deleteSelection from './deleteSelection'

const reducers = {
    [Actions.CLOSE_EDITOR] : closeEditor,
    [Actions.PUBLISH] : publish,
    [Actions.CHANGE_SELECTION] : changeSelection,
    [Actions.START_EDITING] : startEditing,
    [Actions.APPEND_EDITOR] : appendEditor,
    [Actions.START_RENAMING] : startRenaming,
    [Actions.RENAME] : rename,
    [Actions.DELETE_SELECTION] : deleteSelection
};

/** Set of actions which commit to undo/redo stack. */
const commitAction = {
    [Actions.PUBLISH] : true,
    [Actions.RENAME] : true,
    [Actions.DELETE_SELECTION] : true
};

const applyCommand = (state, command) => {
    const result = update(state, command);
    if (result.redo.sections) {
        const versions = result.state.versions;
        return update(result.state, {versions: {
            undoCommand: {$set: merge(result.undo.sections, versions.undoCommand)},
            redoCommand: {$set: merge(versions.redoCommand, result.redo.sections)}
        }}).state;
    }
    return result.state;
};

const commit = state => update(state, {versions: {
    undo: {$splice: [[state.versions.undo.length, 0, {
        undo: state.versions.undoCommand,
        redo: state.versions.redoCommand
    }]]},
    redo: {$set: []},
    undoCommand: {$set: {}},
    redoCommand: {$set: {}}
}}).state;

export default (state, action) => {
    //FIXME handle undo/redo here
    let reducer = reducers[action.type];
    if (reducer === undefined) {
        return state;
    } else {
        const command = reducer(state, action.payload);
        if (command) {
            state = applyCommand(state, command);
        }
        if (commitAction[action.type]) {
            state = commit(state);
        }
        return state;
    }
};