export const deepFreeze = object => {
    if (!Object.isFrozen(object)) {
        if (Array.isArray(object)) {
            Object.freeze(object);
            object.forEach(deepFreeze);
        } else if (object && typeof object === 'object') {
            Object.freeze(object);
            Object.getOwnPropertyNames(object).forEach(property => deepFreeze(object[property]));
        }
    }
};

export default store => next => action => {
    const result = next(action);
    deepFreeze(store.getState());
    return result;
}