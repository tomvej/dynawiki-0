import Actions from '../actions/constants'
import closeEditor from './closeEditor'
import publish from './publish'

const reducers = {
    [Actions.CLOSE_EDITOR] : closeEditor,
    [Actions.PUBLISH] : publish
};

export default (state, action) => {
    let reducer = reducers[action.type];
    if (reducer === undefined) {
        return state;
    } else {
        return reducer(state, action.payload);
    }
};