import Actions from '../actions/constants'
import closeEditor from './closeEditor'

export default (state, action) => {
    switch (action.type) {
        case Actions.CLOSE_EDITOR:
            return closeEditor(state, action.payload);
        default:
            return state;
    }
};