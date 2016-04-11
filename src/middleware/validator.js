import Actions from '../actions/constants'
import { appendEditor } from '../validators'

const validators = {
    [Actions.APPEND_EDITOR] : appendEditor
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