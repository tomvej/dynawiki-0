import Actions from '../actions/constants'
import closeEditor from './closeEditor'
import publish from './publish'
import changeSelection from './changeSelection'
import startEditing from './startEditing'

const reducers = {
    [Actions.CLOSE_EDITOR] : closeEditor,
    [Actions.PUBLISH] : publish,
    [Actions.CHANGE_SELECTION] : changeSelection,
    [Actions.START_EDITING]: startEditing
};

export default (state, action) => {
    let reducer = reducers[action.type];
    if (reducer === undefined) {
        return state;
    } else {
        return reducer(state, action.payload);
    }
};