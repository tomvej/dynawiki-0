const isOtherObject = object => (!Array.isArray(object) && typeof object === 'object');

const merge = (target, object) => {
    Object.getOwnPropertyNames(object).forEach(property => {
        if (target.hasOwnProperty(property)) {
            if (Array.isArray(target[property]) && Array.isArray(object[property])) {
                [].push.apply(target[property], object[property]);
            } else if (isOtherObject(target[property]) && isOtherObject(object[property])) {
                merge(target[property], object[property]);
            } else {
                throw 'Cannot merge ' + target[property] + ' and ' + object[property];
            }
        } else {
            target[property] = object[property];
        }
    });
};

export default merge;