const freeze = object => {
    if (!Object.isFrozen(object)) {
        if (Array.isArray(object)) {
            Object.freeze(object);
            object.forEach(freeze);
        } else if (object && typeof object === 'object') {
            Object.freeze(object);
            Object.getOwnPropertyNames(object).forEach(property => freeze(object[property]));
        }
    }
};
export default freeze;