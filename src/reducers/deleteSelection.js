import update from 'react-addons-update'

export default (state, payload) => {
    let command = {selection: {$set: null}};
    if (state.selection.index === null) {

    } else {
        Object.assign(command, {sections: {[state.selection.section]: {contents: {$splice: [[state.selection.index, 1]]}}}});
    }
    return update(state, command);
};