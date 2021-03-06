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

export const clearSelection = () => ({
    type: Actions.CLEAR_SELECTION
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

export const rename = text => {
    let heading = text.trim();
    if (heading.length === 0) {
        alert('Section heading cannot be null.');
        return;
    }
    return {
        type: Actions.RENAME,
        payload: heading
    };
};

export const deleteSelection = () => ({
    type: Actions.DELETE_SELECTION
});

export const undo = () => ({
    type: Actions.UNDO
});

export const redo = () => ({
    type: Actions.REDO
});

export const startSelection = () => ({
    type: Actions.START_SELECTION
});

export const popup = (visible, x, y) => ({
    type: Actions.POPUP,
    payload: { visible, x, y }
});