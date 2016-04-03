import update from 'react-addons-update'

export default (state, payload) => {
    let updateState = command => {
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