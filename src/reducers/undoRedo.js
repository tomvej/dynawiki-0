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

const isEmpty = object => Object.keys(object).length === 0;

export const commit = state => isEmpty(state.versions.undoCommand) ? state :
    update(state, {versions: {
        undo: {$splice: [[state.versions.undo.length, 0, {
            undo: state.versions.undoCommand,
            redo: state.versions.redoCommand
        }]]},
        redo: {$set: []},
        undoCommand: {$set: {}},
        redoCommand: {$set: {}}
    }}).state;

const moveBetweenStacksAndApply = (src, dst) => state => {
    const srcLen = state.versions[src].length;
    const dstLen = state.versions[dst].length;
    const element = state.versions[src][srcLen-1];
    return update(state, {
        sections: element[src],
        versions: {
            [src]: {$splice: [[srcLen-1, 1]]},
            [dst]: {$splice: [[dstLen, 0, element]]}
        },
        selection: {$set: null}
    }).state;
};

export const undo = moveBetweenStacksAndApply('undo', 'redo');

export const redo = moveBetweenStacksAndApply('redo', 'undo');