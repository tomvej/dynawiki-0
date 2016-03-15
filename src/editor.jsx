import React from 'react';

export class Editor extends React.Component {

    handleChange(event) {
        var value = event.target.value;
        this.props.appendElement(value);
    }

    render() {
        return <textarea rows="10" onChange={this.handleChange.bind(this)}></textarea>;
    }
}