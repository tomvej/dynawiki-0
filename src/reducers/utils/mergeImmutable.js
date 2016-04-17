const isObject = target => !Array.isArray(target) && typeof target === 'object';

const merge = (object, target) => {
    const mergeProperty = (object, target) => {
        if (Array.isArray(object) && Array.isArray(target)) {
            return object.concat(target);
        } else if (isObject(object) && isObject(target)) {
            return merge(object, target);
        } else {
            throw 'Cannot merge ' + object + ' and ' + target;
        }
    };

    const result = {};
    for (const property in object) {
        if (target.hasOwnProperty(property)) {
            result[property] = mergeProperty(object[property], target[property]);
        } else {
            result[property] = object[property];
        }
    }
    for (const property in target) {
        if (!object.hasOwnProperty(property)) {
            result[property] = target[property];
        }
    }
    return result;
};

export default merge;