import update from 'react-addons-update'

export default (state, payload) => {
    let newState = state;
    let updateState = command => {
        newState = update(newState, command);
    }

    let section = state.editor.section;
    let index = state.editor.index;

    let pushParagraph = text => {

    };
    let pushSection = (heading, level) => {

    };

    payload.forEach(element => {
        switch (element.type) {
            case 'section':
                pushSection(element.heading, element.level);
                break;
            case 'paragraph':
                pushParagraph(element.text);
                break;
            default:
                console.warn('Unknown content type: ' + element.type);
        }
    });

    return newState;
}