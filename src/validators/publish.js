export default (payload, state) => {
    let level = Math.max.apply(null, payload.filter(e => e.type === 'section').map(s => s.level));
    let section = state.sections[state.editor.section];

    while (level > 0 && section.parent !== null) {
        section = state.sections[section.parent];
        level--;
    }

    return level > 0 ? ['Trying to add H' + (2-level) + '.'] : null;
};