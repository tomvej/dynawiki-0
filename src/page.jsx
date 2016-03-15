import React from 'react';
import { Section } from './section.jsx';

export class Page extends React.Component {
    render() {
        return <Section data={this.props.data} />;
    }
}