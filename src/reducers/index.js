import { applyCommand, commit, undo, redo } from './undoRedo'

import Actions from '../actions/constants'
import closeEditor from './closeEditor'
import publish from './publish'
import changeSelection from './changeSelection'
import startEditing from './startEditing'
import appendEditor from './appendEditor'
import startRenaming from './startRenaming'
import rename from './rename'
import deleteSelection from './deleteSelection'
import startSelection from './startSelection'
import moveSelection from './moveSelection'
import showPopup from './showPopup'

const reducers = {
    [Actions.CLOSE_EDITOR] : closeEditor,
    [Actions.PUBLISH] : publish,
    [Actions.CHANGE_SELECTION] : changeSelection,
    [Actions.CLEAR_SELECTION]: state => changeSelection(state, null),
    [Actions.START_EDITING] : startEditing,
    [Actions.APPEND_EDITOR] : appendEditor,
    [Actions.START_RENAMING] : startRenaming,
    [Actions.RENAME] : rename,
    [Actions.DELETE_SELECTION] : deleteSelection,
    [Actions.START_SELECTION] : startSelection,
    [Actions.MOVE_SELECTION] : moveSelection,
    [Actions.SHOW_POPUP] : showPopup
};

/** Set of actions which commit to undo/redo stack. */
const commitAction = {
    [Actions.PUBLISH] : true,
    [Actions.RENAME] : true,
    [Actions.DELETE_SELECTION] : true
};

export default (state, action) => {
    if (action.type === Actions.UNDO) {
        return undo(state);
    }
    if (action.type === Actions.REDO) {
        return redo(state);
    }

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