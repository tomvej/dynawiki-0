import deepFreeze from './deepFreeze'

const freeze = object => {
    deepFreeze(object);
    return object;
};

const commandSet = {
    $set: true,
    $splice: true,
    $merge: true
};

const copy = target => {
  if (Array.isArray(target)) {
      return target.concat();
  } else if (target && typeof target === 'object') {
      return Object.assign({}, target);
  } else {
      return target;
  }
};

const update = (state, command) => {
    if (command.hasOwnProperty('$set')) {
        return freeze({
            state: command.$set,
            undo: {$set: state},
            redo: {$set: command.$set}
        });
    }

    const newState = copy(state);
    const undo = {};
    const redo = {};

    if (command.hasOwnProperty('$merge')) {
        Object.assign(newState, command.$merge);

        Object.getOwnPropertyNames(command.$merge).forEach(property => {
            Object.assign(undo, {[property]: {$set: null}});
            Object.assign(redo, {[property]: {$set: command.$merge[property]}});
        });
    }

    if (command.hasOwnProperty('$splice')) {
        undo.$splice = [];
        redo.$splice = command.$splice;

        command.$splice.forEach(args => {
            const removed = newState.splice.apply(newState, args);
            undo.$splice.unshift([args[0], args.length-2].concat(removed)); //reverse order
        });
    }

    Object.getOwnPropertyNames(command).forEach(property => {
        if (!commandSet[property]) {
            const subResult = update(state[property], command[property]);
            newState[property] = subResult.state;
            undo[property] = subResult.undo;
            redo[property] = subResult.redo;
        }
    });

    return freeze({
        state: newState,
        undo: undo,
        redo: redo
    });
};

export default update;