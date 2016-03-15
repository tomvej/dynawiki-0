import React from 'react';

export class Paragraph extends React.Component {
    render() {
        return <p>{this.props.data.text}</p>;
    }
}
