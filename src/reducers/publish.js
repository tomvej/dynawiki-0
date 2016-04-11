import update from 'react-addons-update'

export default (state, payload) => {
    let updateState = command => {
        state = update(state, command);
    };

    let id = state.nextId;
    let sectionId = state.editor.section;
    let index = state.editor.index;
    let currentLevel = 0;

    let updateContents = command => {
        updateState({sections: {[sectionId]: {contents: command}}});
    };
    let updateChildren = command => {
        updateState({sections: {[sectionId]: {children: command}}});
    };
    let section = () => state.sections[sectionId];
    let pushParagraph = text => {
        let paragraph = {
            id: id++,
            text: text
        };
        updateContents({$splice: [[index, 0, paragraph]]});
        index++;
    };
    let pushSection = (heading, level, sourceIndex = 0, children = []) => {
        let after = section().children.slice(sourceIndex);
        updateChildren({$splice: [[sourceIndex, after.length]]});

        if (level === 0) {
            let newId = id++;
            let newSection = {
                id: newId,
                heading: heading,
                parent: sectionId,
                contents: [],
                children: children.concat(after)
            };
            updateState({sections: {
                $merge : {[newId] : newSection},
                [sectionId] : {children: {$push: [newId]}}
            }});
            sectionId = newId;
            index = 0;
            currentLevel++;
        } else {
            sourceIndex = state.sections[section().parent].children.indexOf(sectionId) + 1;
            sectionId = section().parent;
            currentLevel--;
            pushSection(heading, level -1, sourceIndex, children.concat(after));
        }
    };

    payload.forEach(element => {
        switch (element.type) {
            case 'section':
                let orphans = section().contents.slice(index);
                updateContents({$splice: [[index, orphans.length]]});
                pushSection(element.heading, element.level + currentLevel);
                updateContents({$push: orphans});
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
            section: {$set: sectionId},
            index: {$set: index}
        }
    });

    return state;
}