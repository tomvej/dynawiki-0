export const appendEditor = (payload, state) => (
    state.selection === null ? ['Cannot append editor to empty selection.'] : null
);