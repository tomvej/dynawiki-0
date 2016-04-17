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

export const undo = state => state;

export const redo = state => state;

