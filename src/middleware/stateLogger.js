export default store => next => action => {
    let result = next(action);
    console.log(store.getState());
    return result;
}