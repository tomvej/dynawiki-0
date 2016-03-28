import Actions from '../actions/constants'
import closeEditor from './closeEditor'

const reducers = {};
reducers[Actions.CLOSE_EDITOR] = closeEditor;

export default (state, action) => {
    let reducer = reducers[action.type];
    if (reducer === undefined) {
        return state;
    } else {
        return reducer(state, action.payload);
    }
};