import React from 'react';

export class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleChange(event) {
        var value = event.target.value;
        if (value.startsWith('=') && value.endsWith('\n')) {
            if (this.insertSection(value.slice(1, -1))) {
                this.setState({value: ''});
            } else {
                this.setState({value: value.slice(0, -1)});
            }
        } else if (value.endsWith('\n\n')) {
            this.props.insertParagraph(value.slice(0, -2));
            this.setState({value: ''});
        } else {
            this.setState({value: value});
        }
    }

    insertSection(text) {
        if (!text.match(/^(>*|<*)\s+/)) {
            alert('Wrong section format:\n=' + text + '\nMust be \'= Heading\', \'=>... Heading\' or \'=<... Heading\'.');
            return false;
        }
        var length = text.match(/^(>*|<*)/)[0].length;
        if (text.startsWith('<')) {
            length = -length;
        }
        return this.props.insertSection(text.slice(length).trim(), length);
    }

    render() {
        return <textarea rows="10"
                         onChange={this.handleChange.bind(this)}
                         value={this.state.value} />
    }
}