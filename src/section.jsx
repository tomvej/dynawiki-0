import React from 'react';
import { Editor } from './editor.jsx';
import { Paragraph } from './paragraph.jsx';
import { Header } from './header.jsx';

export class Section extends React.Component {
    contents() {
        return this.props.data.contents.map(elem => {
            switch (elem.type) {
                case 'editor':
                    return <Editor key="editor" data={elem}/>;
                case 'paragraph':
                    return <Paragraph key={elem.id} data={elem}/>;
                case 'section':
                    return <Section key={elem.id} data={elem}/>;
            }
        });
    }

    render() {
        return (
            <section>
                <Header title={this.props.data.heading} />
                {this.contents()}
            </section>
        );
    }
}