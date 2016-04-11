import update from 'react-addons-update'

export default (state, payload) => (state.editor === null ? update(state, {selection: {$set: payload}}) : state);