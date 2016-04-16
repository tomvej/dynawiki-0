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
        return {
            state: command.$set
        };
    }

    const newState = copy(state);

    if (command.hasOwnProperty('$merge')) {
        Object.assign(newState, command.$merge);
    }

    if (command.hasOwnProperty('$splice')) {
        command.$splice.forEach(args => {
            newState.splice.apply(newState, args);
        });
    }

    for (const property in command) {
        if (!commandSet[property]) {
            newState[property] = update(state[property], command[property]).state;
        }
    }

    return {
        state: newState
    };
};

export default update;