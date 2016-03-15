import React from 'react';
import { Editor } from './editor.jsx';
import { Paragraph } from './paragraph.jsx';
import { Header } from './header.jsx';

export class Section extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.data;
    }

    appendContent(element) {
        console.log(element);
    }

    renderContent(element) {
        switch (element.type) {
            case 'editor': return <Editor key="editor" data={element} appendElement={this.appendContent} />;
            case 'paragraph': return <Paragraph key={element.id} data={element} />;
            case 'section': return <Section key={element.id} data={element} getId={this.props.getId} />;
            default: console.warn('Unknown content type: ' + element.type)
        }
    }

    render() {
        return (
            <section>
                <Header title={this.state.heading} />
                {this.state.contents.map(this.renderContent.bind(this))}
            </section>
        );
    }
}