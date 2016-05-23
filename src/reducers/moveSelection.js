import { Direction } from '../actions/moveSelection'

const moveToParent = state => {
    if (state.selection.index === null) {
        const parent = state.sections[state.selection.section].parent;
        if (parent === null) {
            return null;
        } else {
            return {selection: {section: {$set: parent}}}
        }
    } else {
        return {selection: {index: {$set: null}}};
    }
};
const moveUp = state => null;

const moveDown = state => null;

export default (state, payload) => {
    if (state.selection === null) {
        return null;
    }

    return {
        [Direction.PARENT]: moveToParent,
        [Direction.UP]: moveUp,
        [Direction.DOWN]: moveDown
    }[payload](state);

}