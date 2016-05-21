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

export default (state, payload) => {
    if (state.selection === null) {
        return null;
    }

    return {
        [Direction.PARENT]: moveToParent
    }[payload](state);

}