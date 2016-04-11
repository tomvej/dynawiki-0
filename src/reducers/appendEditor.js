import update from 'react-addons-update'

export default (state, payload) => update(state, {
    selection: {$set: null},
    editor: {$set: {
        section: state.selection.section,
        index: state.selection.index === null ? 0 : state.selection.index + 1
    }}
});