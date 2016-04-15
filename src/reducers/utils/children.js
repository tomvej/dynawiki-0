const flatten = (element, array) => [].concat.apply(element, array);

const children = (state, id) => {
    let localChildren = state.sections[id].children;
    return flatten(localChildren, localChildren.map(id => children(state,id)));
};

export default children;