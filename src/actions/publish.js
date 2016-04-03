import Actions from './constants'

export default (text) => {
    let buffer = [];
    let result = [];
    let errors = [];
    let lastLevel = 0;

    function pushParagraph() {
        if (buffer.length > 0) {
            result.push({
                type: 'paragraph',
                text: buffer.join('\n')
            });
            buffer = [];
        }
    }
    function pushSection(text) {
        if (!text.match(/^=(=|<*)/)) {
            errors.push('Wrong heading format:\n' + text + '\nMust be "=... Heading" or "=<... Heading"');
            return;
        }

        let heading = text.replace(/^==+|^=<*/, '').trim();
        if (heading.length == 0) {
            errors.push('Empty heading: ' + text);
            return;
        }

        let level;
        if (text.match(/^==+/)) {
            level = 2 - text.match(/^==+/)[0].length;
        } else if (text.match(/^=<+/)) {
            level = text.match(/^=<+/)[0].length;
        } else {
            level = 1;
        }

        if (lastLevel - level > 1) {
            errors.push('You cannot go from Hn to H(n+2) directly:\n' + text);
            return;
        }
        result.push({
            type: 'section',
            heading: heading,
            level: level
        });
        lastLevel = level;
    }

    text.split('\n').forEach(line => {
        if (line.startsWith('=')) {
            pushParagraph();
            pushSection(line);
        } else if (line.match('^$')) {
            pushParagraph();
        } else {
            buffer.push(line);
        }
    });
    pushParagraph();

    if (errors.length > 0) {
        alert(errors.join('\n'));
    } else {
        return {
            type: Actions.PUBLISH,
            payload: result
        };
    }
}