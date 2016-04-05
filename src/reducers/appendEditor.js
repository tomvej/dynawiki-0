import update from 'react-addons-update'

//TODO move to validation
export default (state, payload) => (state.selection === null ? state : update(state, {
    selection: {$set: null},
    editor: {$set: {
        section: state.selection.section,
        index: state.selection.index === null ? 0 : state.selection.index + 1
    }}
}));