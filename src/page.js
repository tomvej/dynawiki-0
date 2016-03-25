import React from 'react';
import { Section } from './section.js';

function hasEditor(data) {
    if (data.type === 'editor') {
        return true;
    } else if (data.contents !== undefined) {
        return data.contents.some(hasEditor);
    } else {
        return false;
    }
}

export class Page extends React.Component {


    constructor(props) {
        super(props);
        var assigned = new IdAssigner(props.data);
        var selection = hasEditor(props.data) ? 'editor' : null;

        this.state = {
            id: assigned.getSize(),
            data: assigned.getData(),
            selection: selection
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps
            || this.state.selection !== nextState.selection;
    }

    getId() {
        var id = this.state.id;
        this.setState({id: id + 1});
        return id;
    }

    setSelected(id) {
        if (this.state.selection !== 'editor' || id === null) {
            this.setState({selection: id});
        }
    }

    render() {
        return <Section data={this.state.data}
                        getId={this.getId.bind(this)}
                        selection={this.state.selection} setSelected={this.setSelected.bind(this)}/>;
    }
}

class IdAssigner {
    constructor(data) {
        this.id = 0;
        this.data = this._assignIds(data);
    }

    _assignIds(element) {
        /* there is single editor, it has no id */
        if (element.type === 'editor') {
            return element;
        }

        var contents;
        if (element.contents !== undefined) {
            contents = [];
            element.contents.forEach(e => {
                contents.push(this._assignIds(e))
            });
        }

        var id = this.id++;
        return Object.assign({}, element, {id: id, contents: contents});
    }

    getSize() {
        return this.id;
    }

    getData() {
        return this.data;
    }
}

