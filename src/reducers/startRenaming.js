export default (state, payload) => ({
    selection: {$set: null},
    editor: {$set: state.selection}
});