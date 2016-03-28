import Actions from './constants'

export { default as publish } from './publish'

export const closeEditor = () => ({
    type: Actions.CLOSE_EDITOR
});