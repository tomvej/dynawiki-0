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
const moveUp = state => {
    const getRightmostChild = section => {
        const children = state.sections[section].children;
        return children.length ? getRightmostChild(children[children.length - 1]) : section;
    };
    const {section, index} = state.selection;
    if (index !== null) {
        return {selection: {index: {$set: index > 0 ? index - 1 : null}}};
    } else {
        const parent = state.sections[section].parent;
        if (parent === null) {
            return null;
        } else {
            var parentChildren = state.sections[parent].children;
            const indexInParent = parentChildren.indexOf(section);
            const newSection = indexInParent ? getRightmostChild(parentChildren[indexInParent - 1]) : parent;
            const newSectionContentsLength = state.sections[newSection].contents.length;
            if (newSectionContentsLength) {
                return {selection: {$set: {section: newSection, index: newSectionContentsLength - 1}}};
            } else {
                return {selection: {section: {$set: newSection}}};
            }
        }
    }
};

const moveDown = state => {
    const getFirstChildOrSibling = section => {
        const children = state.sections[section].children;
        if (children.length) {
            return children[0];
        } else {
            return getNextSibling(section);
        }
    };
    const getNextSibling = section => {
        const parent = state.sections[section].parent;
        if (parent === null) {
            return null;
        }

        const parentChildren = state.sections[parent].children;
        const index = parentChildren.indexOf(section) + 1;
        return index < parentChildren.length ? parentChildren[index] : getNextSibling(parent);
    };

    const {section, index} = state.selection;
    if (index === null) {
        if (state.sections[section].contents.length) {
            return {selection: {index: {$set: 0}}};
        } else {
            const newSection = getFirstChildOrSibling(section);
            return newSection !== null ? {selection: {section: {$set: newSection}}} : null;
        }
    } else if (index < state.sections[section].contents.length - 1) {
        return {selection: {index: {$set: index + 1}}};
    } else {
        const newSection = getFirstChildOrSibling(section);
        return newSection !== null ? {selection: {$set: {section: newSection, index: null}}} : null;
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