const isOtherObject = object => (!Array.isArray(object) && typeof object === 'object');

const merge = (target, object) => {
    if(Array.isArray(target) && Array.isArray(object)) {
        [].push.apply(target, object);
    } else if (isOtherObject(target) && isOtherObject(object)) {
        Object.getOwnPropertyNames(object).forEach(property => {
            if (target.hasOwnProperty(property)) {
                merge(target[property], object[property]);
            } else {
                target[property] = object[property];
            }
        });
    } else {
        throw `Cannot merge ${target} and ${object}.`;
    }
};

export default merge;