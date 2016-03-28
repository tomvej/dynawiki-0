import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Editor from './Editor'

const mapStateToProps = (state, ownProps) => ({
        section: state.sections[ownProps.id],
        editor: (state.editor !== null && state.editor.section === ownProps.id) ? state.editor.index : null
    });

const Section = ({section, editor}) => {
    let pars = section.contents.map(({id, text}) => <p key={id}>{text}</p>);
    if (editor !== null) {
        pars.splice(editor, 0, <Editor key="editor"/>);
    }
    return (
        <section>
            <h1>{section.heading}</h1>
            {pars}
            {section.children.map(id => <SectionContainer key={id} id={id}/>)}
        </section>
    );
};

const SectionContainer = connect(
    mapStateToProps,
    dispatch => ({})
)(Section);

SectionContainer.propTypes = {
  id : PropTypes.number.isRequired
};

export default SectionContainer;
