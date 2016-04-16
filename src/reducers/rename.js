export default (state, payload) => ({
    sections: {[state.editor.section]: {heading: {$set: payload}}},
    editor: {$set: null},
    selection: {$set: state.editor}
});