import update from './utils/update'
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
const commitActions = {
    [Actions.PUBLISH] : true,
    [Actions.RENAME] : true,
    [Actions.DELETE_SELECTION] : true
};

export default (state, action) => {
    let reducer = reducers[action.type];
    if (reducer === undefined) {
        return state;
    } else {
        const command = reducer(state, action.payload);
        return command ? update(state, command).state : state;
    }
};