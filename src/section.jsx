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
        var editorIndex = this.state.contents.findIndex(e => e.type === 'editor');
        var beforeContents = this.state.contents.slice(0, editorIndex);
        var afterContents = this.state.contents.slice(editorIndex);
        var afterPars = afterContents.filter(e => e.type !== 'section');
        var afterSections = afterContents.filter(e => e.type === 'section');

        var section = {
            id: this.props.getId(),
            type: 'section',
            heading: text,
            contents: afterPars
        };

        if (level === 0) {
            this.setState({contents: beforeContents.concat(section)});
            return true;
        } else if (this.props.insertChildSection !== undefined) {
            if (this.props.insertChildSection(this.state.id, [section].concat(afterSections), level - 1)) {
                this.setState({contents: beforeContents});
                return true;
            } else {
                return false;
            }
        } else {
            alert('You cannot insert a H1 or higher.');
            return false;
        }
    }

    insertChildSection(sourceId, children, level) {
        var sectionIndex = this.state.contents.findIndex(e => e.id === sourceId);
        var beforeContents = this.state.contents.slice(0, sectionIndex + 1);
        var afterContents = this.state.contents.slice(sectionIndex + 1);

        if (level === 0) {
            this.setState({contents: beforeContents.concat(children, afterContents)});
            return true;
        } else if (this.props.insertChildSection !== undefined){
            if (this.props.insertChildSection(this.state.id, children.concat(afterContents), level - 1)) {
                this.setState({contents: beforeContents});
                return true;
            } else {
                return false;
            }
        } else {
            alert('You cannot insert a H1 or higher.');
            return false;
        }
    }

    renderContent(element) {
        switch (element.type) {
            case 'editor': return <Editor key="editor" data={element}
                                          insertParagraph={this.insertParagraph.bind(this)}
                                          insertSection={this.insertSection.bind(this)} />;
            case 'paragraph': return <Paragraph key={element.id} data={element} />;
            case 'section': return <Section key={element.id} data={element}
                                            getId={this.props.getId}
                                            insertChildSection={this.insertChildSection.bind(this)} />;
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