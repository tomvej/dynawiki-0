export default (state, payload) => ({
    selection: {$set: null},
    editor: {$set: {
        section: state.selection.section,
        index: state.selection.index === null ? 0 : state.selection.index + 1
    }}
});