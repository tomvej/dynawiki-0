import Actions from '../actions/constants'

const validators = {
};

export default store => next => action => {
    const validator = validators[action.type];

    if (validator) {
        const errors = validator(action.payload, store.getState());
        if (errors) {
            alert(errors.join('\n\n'));
            errors.forEach(e => console.error(e));
            return null;
        }
    }

    return next(action);
};