import update from 'react-addons-update'

const flatten = (element, array) => [].concat.apply(element, array);

const exportSectionInternal = (state, section, level = 0) => (flatten(
        section.contents.map(par => par.text),
        section.children.map(id => state.sections[id]).map(sec => flatten(
            ['='.repeat(level + 2) + ' ' + sec.heading],
            exportSectionInternal(state, sec, level + 1)
        ))
    )
);

const exportSection = (state, id) => exportSectionInternal(state, state.sections[id]).join('\n\n');

export default (state, payload) => {
    const updateState = command => {
        state = update(state, command);
    };

    if (state.selection === null) { //TODO move to validation
        return state;
    }
    let section = state.selection.section;
    let index = state.selection.index;
    let text = '';

    if (index !== null) {
        text = state.sections[section].contents[index].text;
        updateState({sections: {[section]: {contents: {$splice: [[index, 1]]}}}});
    } else {
        index = 0;
        text = exportSection(state, section);
        updateState({sections: {[section]: {
            contents: {$set: []},
            children: {$set: []}
        }}});
        //TODO remove orphaned sections
    }
    updateState({
        selection: {$set: null},
        editor: {$set: {
            section: section,
            index: index,
            text: text
        }}
    });

    return state;
}