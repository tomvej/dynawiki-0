import Actions from './constants'

export const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    PARENT: 'PARENT'
};

export const moveSelectionUp = () => ({
    type: Actions.MOVE_SELECTION,
    payload: Direction.UP
});

export const moveSelectionDown = () => ({
    type: Actions.MOVE_SELECTION,
    payload: Direction.DOWN
});

export const moveSelectionToParent = () => ({
    type: Actions.MOVE_SELECTION,
    payload: Direction.PARENT
});