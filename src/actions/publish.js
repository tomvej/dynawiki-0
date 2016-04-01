import Actions from './constants'

export default (text) => {
    let buffer = [];
    let result = [];
    let errors = [];
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
            errors.push('Wrong heading format:\n' + text + '\nMust be "= Heading", "== Heading" or "=<... Heading"');
            return;
        }

        let heading = text.replace(/^==|^=<*/, '').trim();
        if (heading.length == 0) {
            errors.push('Empty heading: ' + text);
            return;
        }

        let level;
        if (text.match(/^==/)) {
            level = 0;
        } else if (text.match(/^=<+/)) {
            level = text.match(/^=<+/)[0].length;
        } else {
            level = 1;
        }
        result.push({
            type: 'section',
            heading: heading,
            level: level
        });
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

    if (errors.length > 0) {
        alert(errors.join('\n'));
    } else {
        return {
            type: Actions.PUBLISH,
            payload: result
        };
    }
}