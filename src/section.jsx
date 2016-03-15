import React from 'react';
import { Editor } from './editor.jsx';
import { Paragraph } from './paragraph.jsx';
import { Header } from './header.jsx';

export class Section extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.data;
    }

    insertParagraph(text) {
        var paragraph = {
            id: this.props.getId(),
            type: 'paragraph',
            text: text
        };

        var contents = [];
        this.state.contents.forEach(e => {
            if (e.type === 'editor') {
                contents.push(paragraph);
            }
            contents.push(e);
        });
        this.setState({contents: contents});
    }

    insertSection(text, level) {
        //TODO implement insert section
    }

    renderContent(element) {
        switch (element.type) {
            case 'editor': return <Editor key="editor" data={element}
                                          insertParagraph={this.insertParagraph.bind(this)}
                                          insertSection={this.insertSection.bind(this)} />;
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