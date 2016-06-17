export default (state, payload) => (
    {popup: {$set: (payload.visible ? {} : null)}}
)