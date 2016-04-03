import Actions from './constants'

export { default as publish } from './publish'

export const closeEditor = () => ({
    type: Actions.CLOSE_EDITOR
});

export const changeSelection = id => ({
    type: Actions.CHANGE_SELECTION,
    payload: id
});

export const startEditing = () => ({
    type: Actions.START_EDITING
});