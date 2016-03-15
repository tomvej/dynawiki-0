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
        if (value.endsWith('\n\n')) {
            this.props.appendContent({
                type: 'paragraph',
                text: value.slice(0, -2)
            });
            this.setState({value: ''});
        } else {
            this.setState({value: value});
        }
    }

    render() {
        return <textarea rows="10"
                         onChange={this.handleChange.bind(this)}
                         value={this.state.value} />
    }
}