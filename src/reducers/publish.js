import update from 'react-addons-update'

export default (state, payload) => {
    let updateState = command => {
        state = update(state, command);
    };
    let parent = () => state.sections[section].parent;

    let id = state.nextId;
    let section = state.editor.section;
    let index = state.editor.index;

    //TODO implement forget orphaned paragraphs

    let pushParagraph = text => {
        let paragraph = {
            id: id++,
            text: text
        };
        updateState({sections: {[section]: {contents: {$splice: [[index, 0, paragraph]]}}}});
        index++;
    };
    let pushSection = (heading, level, sourceIndex = 0, children = []) => {
        let after = state.sections[section].children.slice(sourceIndex);
        updateState({sections: {[section]: {children: {$splice: [[sourceIndex, after.length]]}}}});

        if (level === 0) {
            let newId = id++;
            let newSection = {
                id: newId,
                heading: heading,
                parent: section,
                contents: [],
                children: children.concat(after)
            };
            updateState({sections: {
                $merge : {[newId] : newSection},
                [section] : {children: {$push: [newId]}}
            }});
            section = newId;
            index = 0;
        } else if (parent() !== null) {
            sourceIndex = state.sections[parent()].children.indexOf(section) + 1;
            section = parent();
            pushSection(heading, level -1, sourceIndex, children.concat(after));
        } else {
            console.error('Trying to add another H1. Ignoring.'); //TODO move to validation
        }
    };

    payload.forEach(element => {
        switch (element.type) {
            case 'section':
                pushSection(element.heading, element.level);
                break;
            case 'paragraph':
                pushParagraph(element.text);
                break;
            default:
                console.warn('Unknown content type: ' + element.type);
        }
    });

    updateState({
        nextId: {$set: id},
        editor: {
            section: {$set: section},
            index: {$set: index}
        }
    });

    return state;
}