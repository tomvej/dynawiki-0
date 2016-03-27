import React from 'react';
import { connect } from 'react-redux';

import Editor from './Editor';

const mapStateToProps = (state, ownProps) => {
    let id = parseInt(ownProps.id); //ownProps passed as string
    return {
        section: state.sections[id],
        editor: (state.editor !== null && state.editor.section === id) ? state.editor.index : null
    }
};

const Section = ({section, editor}) => {
    let pars = section.contents.map(({id, text}) => <p key={id}>{text}</p>);
    if (editor !== null) {
        pars.splice(editor, 0, <Editor key="editor"/>);
    }
    return (<section>
        <h1>{section.heading}</h1>
        {pars}
        {section.children.map(id => <SectionContainer key={id} id={id}/>)}
    </section>)};

const SectionContainer = connect(
    mapStateToProps,
    dispatch => ({})
)(Section);

export default SectionContainer;
