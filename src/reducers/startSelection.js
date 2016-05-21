import changeSelection from './changeSelection'

export default (state, payload) => state.selection === null ? changeSelection(state, {section: 0, index: null}) : null;