import update from 'react-addons-update'

//TODO move 'editor === null check' to validation
export default (state, payload) => (state.editor === null ? update(state, {selection: {$set: payload}}) : state);