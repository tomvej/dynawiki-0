import update from 'react-addons-update'

export default (state, payload) => update(state, {editor: {$set: null}});