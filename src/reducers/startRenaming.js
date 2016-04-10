import update from 'react-addons-update'

export default (state, payload) => {
    if (state.selection === null || state.selection.index !== null) {
        return state; //TODO move to validation
    }

    return update(state, {
        selection: {$set: null},
        editor: {$set: state.selection}
    });
};