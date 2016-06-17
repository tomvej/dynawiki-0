export default (state, payload) => {
    if (state.selection === null) {
        return null;
    }
    
    return ({popup: {$set: (payload.visible ? {} : null)}}
)}