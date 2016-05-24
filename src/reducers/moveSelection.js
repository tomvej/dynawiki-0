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

const moveDown = state => {
    const getFirstChild = section => {
        const children = state.sections[section].children;
        if (children.length) {
            return children[0];
        } else {
            return getNextSibling(section);
        }
    };
    const getNextSibling = section => {
        
    };
    const {section, index} = state.selection;

    if (index === null) {
        if (state.sections[section].contents.length) {
            return {selection: {index: {$set: 0}}};
        } else {
            return {selection: {section: {$set: getFirstChild(section)}}};
        }
    } else if (index < state.sections[section].contents.length - 1) {
        return {selection: {index: {$set: index + 1}}};
    } else {
        return {selection: {$set: {section: getFirstChild(section), index: null}}};
    }
};

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