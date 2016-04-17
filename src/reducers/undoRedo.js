import update from './utils/update'
import merge from './utils/mergeImmutable'

export const applyCommand = (state, command) => {
    const result = update(state, command);
    if (result.redo.sections) {
        const versions = result.state.versions;
        return update(result.state, {versions: {
            undoCommand: {$set: merge(result.undo.sections, versions.undoCommand)},
            redoCommand: {$set: merge(versions.redoCommand, result.redo.sections)}
        }}).state;
    }
    return result.state;
};

export const commit = state => update(state, {versions: {
    undo: {$splice: [[state.versions.undo.length, 0, {
        undo: state.versions.undoCommand,
        redo: state.versions.redoCommand
    }]]},
    redo: {$set: []},
    undoCommand: {$set: {}},
    redoCommand: {$set: {}}
}}).state;

export const undo = state => {
    const undoLength = state.versions.undo.length;
    const redoLength = state.versions.redo.length;
    const undo = state.versions.undo[undoLength-1];
    console.log(undo);
    return update(state, {
        sections: undo.undo,
        versions: {
            undo: {$splice: [[undoLength - 1, 1]]},
            redo: {$splice: [[redoLength, 0, undo]]}
        }
    }).state;
};

export const redo = state => {
    const undoLength = state.versions.undo.length;
    const redoLength = state.versions.redo.length;
    const redo = state.versions.redo[redoLength-1];
    return update(state, {
        sections: redo.redo,
        versions: {
            undo: {$splice: [[undoLength, 0, redo]]},
            redo: {$splice: [[redoLength - 1, 1]]}
        }
    }).state;
};

