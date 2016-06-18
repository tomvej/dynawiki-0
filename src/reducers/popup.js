export default (state, payload) => {
    if (state.selection === null) {
        return null;
    }

    const visible = payload.visible !== undefined ? payload.visible : !state.popup;
    const popup = visible ? {x: payload.x, y: payload.y} : null;
    return {popup: {$set: popup}};
}