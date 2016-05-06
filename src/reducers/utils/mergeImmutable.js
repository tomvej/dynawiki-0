const isObject = target => !Array.isArray(target) && typeof target === 'object';

const merge = (object, target) => {
    if (Array.isArray(object) && Array.isArray(target)) {
        return object.concat(target);
    } else if (isObject(object) && isObject(target)) {
        const result = {};
        Object.getOwnPropertyNames(object).forEach(property => {
            if(target.hasOwnProperty(property)) {
                result[property] = merge(object[property], target[property]);
            } else {
                result[property] = object[property];
            }
        });
        Object.getOwnPropertyNames(target).forEach(property => {
            if (!object.hasOwnProperty(property)) {
                result[property] = target[property];
            }
        });
        return result;
    } else {
        throw `Cannot merge ${object} and ${target}.`;
    }
};

export default merge;