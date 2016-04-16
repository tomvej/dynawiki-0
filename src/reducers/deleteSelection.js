import children from './utils/children'

export default (state, payload) => {
    let command = {selection: {$set: null}};
    if (state.selection.index === null) {
        let section = state.selection.section;
        let parent = state.sections[section].parent;
        if (parent === null) { // cannot remove top-level section
            Object.assign(command, { sections: {[section]: {
                contents: {$set: []},
                children: {$set: []}
            }}});
        } else {
            let index = state.sections[parent].children.indexOf(section);
            Object.assign(command, {sections: {
                [section]: {$set: null},
                [parent]: {children: {$splice: [[index, 1]]}}
            }});
        }
        children(state, section).forEach(s => Object.assign(command.sections, {[s]: {$set: null}}));
    } else {
        Object.assign(command, {sections: {[state.selection.section]: {contents: {$splice: [[state.selection.index, 1]]}}}});
    }
    return command;
};