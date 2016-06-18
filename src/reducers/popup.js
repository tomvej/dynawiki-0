export default (state, payload) => {
    if (state.selection === null) {
        return null;
    }

    const popup = payload.visible ? {x: payload.x, y: payload.y} : null;
    return {popup: {$set: popup}};
}