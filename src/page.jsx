import React from 'react';
import { Section } from './section.jsx';

export class Page extends React.Component {

    constructor(props) {
        super(props);
        this.id = 0;
        this.data = this.assignIds(props.data);
    }

    assignIds(element) {
        if (element.type === 'editor') {
            return element;
        }

        var contents;
        if (element.contents !== undefined) {
            contents = [];
            element.contents.forEach(e => {
               contents.push(this.assignIds(e));
            });
        }

        var id = this.id++;
        return Object.assign({}, element, {id: id, contents: contents});
    }

    getId() {
        return this.id++;
    }

    render() {
        return <Section data={this.data} getId={this.getId}/>;
    }
}