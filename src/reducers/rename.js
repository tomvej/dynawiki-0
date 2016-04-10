import update from 'react-addons-update'

export default (state, payload) => update(state, {
    sections: {[state.editor.section]: {heading: {$set: payload}}},
    editor: {$set: null},
    selection: {$set: state.editor}
});