import merge from './utils/merge'

export default (state, payload) => {
    const rootCommand = {};

    let id = state.nextId;
    let sectionId = state.editor.section;
    let index = state.editor.index;
    let currentLevel = 0;

    const addedSections = {};
    const parentMap = {};
    const childrenMap = {};

    const pushParagraph = text => {
        const paragraph = {
            id: id++,
            text: text
        };
        const addedSection = addedSections[sectionId];
        if (addedSection) {
            addedSection.contents.splice(index, 0, paragraph);
        } else {
            merge(rootCommand, {sections: {[sectionId]: {contents: {$splice: [[index, 0, paragraph]]}}}});
        }
        index++;
    };
    const updateChild = parent => child => {
        const addedSection = addedSections[child];
        if (addedSection) {
            addedSection.parent = parent;
        } else {
            parentMap[child] = parent;
        }
    };
    const getParent = () => {
        const addedSection = addedSections[sectionId];
        if (addedSection) {
            return addedSection.parent;
        } if (parentMap.hasOwnProperty(sectionId)) {
            return parentMap[sectionId];
        } else {
            return state.sections[sectionId].parent;
        }
    };
    const getChildren = parentId => (childrenMap.hasOwnProperty(parentId) ? childrenMap[parentId] : state.sections[parentId].children.concat());
    const addToParent = (sourceIndex, orphans) => {
        const addedSection = addedSections[getParent()];
        if (addedSection) {
            addedSection.children.splice(sourceIndex, 0, sectionId, ...orphans);
        } else {
            const parentId = getParent();
            merge(rootCommand, {sections: {[parentId]: {children: {$splice: [[sourceIndex, 0, sectionId, ...orphans]]}}}});
            childrenMap[parentId] = getChildren(parentId);
            childrenMap[parentId].splice(sourceIndex, 0, sectionId, ...orphans);
        }
    };
    const mergeOrphans = (sourceIndex, orphans) => {
        const addedSection = addedSections[sectionId];
        if (addedSection) {
            if (sourceIndex < addedSection.children.length) {
                orphans = orphans.concat(addedSection.children.splice(sourceIndex, addedSection.children.length - sourceIndex));
            }
        } else {
            const originalChildren = getChildren(sectionId);
            if (sourceIndex < originalChildren.length) {
                merge(rootCommand, {sections: {[sectionId]: {children: {$splice: [[sourceIndex, originalChildren.length - sourceIndex]]}}}});
                orphans = orphans.concat(originalChildren.splice(sourceIndex, originalChildren.length - sourceIndex));
                childrenMap[getParent()] = originalChildren;
            }
        }
        return orphans;
    };
    const pushSection = (heading, level, sourceIndex = 0, orphans = []) => {
        orphans = mergeOrphans(sourceIndex, orphans);
        if (level === 0) {
            let newId = id++;
            let newSection = {
                id: newId,
                parent: sectionId,
                heading: heading,
                contents: [],
                children: []
            };
            orphans.forEach(updateChild(sectionId)); //update children

            sectionId = newId;
            addedSections[newId] = newSection;
            addToParent(sourceIndex, orphans);
            index = 0;
            currentLevel++;
        } else {
            const parentId = getParent();
            const parentChildren = addedSections[parentId] ? addedSections[parentId].children : getChildren(parentId);
            sourceIndex = parentChildren.indexOf(sectionId) + 1;
            sectionId = getParent();
            currentLevel--;
            pushSection(heading, level - 1, sourceIndex, orphans);
        }
    };

    const orphanedPars = payload.find(e => e.type === 'section') ? state.sections[sectionId].contents.slice(index) : [];
    if (orphanedPars.length > 0) {
        merge(rootCommand, {sections: {[sectionId]: {contents: {$splice: [[index, orphanedPars.length]]}}}});
    }
    payload.forEach(element => {
        switch(element.type) {
            case 'section':
                pushSection(element.heading, element.level + currentLevel);
                break;
            case 'paragraph':
                pushParagraph(element.text);
                break;
        }
    });
    if (orphanedPars.length > 0) {
        [].push.apply(addedSections[sectionId].contents, orphanedPars);
    }

    merge(rootCommand, {sections: {$merge: addedSections}});

    Object.getOwnPropertyNames(parentMap).forEach(child => {
        merge(rootCommand, {sections: {[child]: {parent: {$set: parentMap[child]}}}});
    });

    merge(rootCommand, {
        nextId: {$set: id},
        editor: {$set: {
            section: sectionId,
            index: index,
            text: ''
        }}
    });

    return rootCommand;
};