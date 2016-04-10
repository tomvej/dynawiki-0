import Actions from './constants'

export { default as publish } from './publish'

export const closeEditor = () => ({
    type: Actions.CLOSE_EDITOR
});

export const changeSelection = (section, index) => ({
    type: Actions.CHANGE_SELECTION,
    payload: {
        section: section,
        index: index
    }
});

export const startEditing = () => ({
    type: Actions.START_EDITING
});

export const appendEditor = () => ({
    type: Actions.APPEND_EDITOR
});

export const startRenaming = () => ({
    type: Actions.START_RENAMING
});