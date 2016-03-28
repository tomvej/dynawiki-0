export default store => next => action => {
    console.log('Dispatching ' + action.type + ': ' + JSON.stringify(action.payload));
    return next(action);
};