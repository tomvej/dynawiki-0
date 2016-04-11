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

const children = (state, id) => {
    let localChildren = state.sections[id].children;
    return flatten(localChildren, localChildren.map(id => children(state,id)));
};

export default (state, payload) => {
    let section = state.selection.section;
    let index = state.selection.index;
    let text = '';
    let sectionsUpdate;

    if (index !== null) {
        text = state.sections[section].contents[index].text;
        sectionsUpdate = {[section]: {contents: {$splice: [[index, 1]]}}};
    } else {
        index = 0;
        text = exportSection(state, section);

        sectionsUpdate = {};
        children(state, section).forEach(id =>
            Object.assign(sectionsUpdate, {[id]: {$set: undefined}})
        );
        Object.assign(sectionsUpdate, {
            [section]: {
                contents: {$set: []},
                children: {$set: []}
            }
        });
    }

    return update(state, {
        sections: sectionsUpdate,
        selection: {$set: null},
        editor: {$set: {
            section: section,
            index: index,
            text: text
        }}
    });
}