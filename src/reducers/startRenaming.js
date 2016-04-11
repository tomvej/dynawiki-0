import update from 'react-addons-update'

export default (state, payload) => update(state, {
    selection: {$set: null},
    editor: {$set: state.selection}
});