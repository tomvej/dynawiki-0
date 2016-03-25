import React from 'react';

export class Paragraph extends React.Component {
    select(event) {
        this.props.setSelected(this.props.data.id);
        event.stopPropagation();
    }

    render() {
        return <p onClick={this.select.bind(this)}>{this.props.data.text}</p>;
    }
}
