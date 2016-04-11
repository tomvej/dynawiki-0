export { default as publish } from './publish'

export const appendEditor = (payload, state) => (
    state.selection === null ? ['Cannot append editor to empty selection.'] : null
);

export const startRenaming = (payload, state) => (
    state.selection === null || state.selection.index !== null ? ['Section must be selected.'] : null
);

export const startEditing = (payload, state) => (
    state.selection === null ? ['Cannot edit without selection.'] : null
);