import React from 'react';
import { Editor } from './editor.jsx';
import { Paragraph } from './paragraph.jsx';
import { Header } from './header.jsx';

export class Section extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            heading: props.data.heading,
            contents: props.data.contents
        };
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

        return this.insertSectionOrMoveItUp([section], beforeContents, afterSections, level);
    }

    insertChildSection(sourceId, children, level) {
        var sectionIndex = this.state.contents.findIndex(e => e.id === sourceId);
        var beforeContents = this.state.contents.slice(0, sectionIndex + 1);
        var afterContents = this.state.contents.slice(sectionIndex + 1);

        return this.insertSectionOrMoveItUp(children, beforeContents, afterContents, level);
    }

    insertSectionOrMoveItUp(children, before, after, level) {
        if (level === 0) {
            this.setState({contents: before.concat(children, after)});
            return true;
        } else if (this.props.insertChildSection === undefined) {
            alert('You cannot insert a H1 or higher.');
            return false;
        } else if (this.props.insertChildSection(this.props.data.id, children.concat(after), level - 1)) {
            this.setState({contents: before});
            return true;
        } else {
            return false;
        }
    }

    deleteEditor() {
        this.setState({contents: this.state.contents.filter(e => e.type !== 'editor')});
    }

    renderContent(element) {
        switch (element.type) {
            case 'editor': return <Editor key="editor" data={element}
                                          insertParagraph={this.insertParagraph.bind(this)}
                                          insertSection={this.insertSection.bind(this)}
                                          deleteEditor={this.deleteEditor.bind(this)} />;
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