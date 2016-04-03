import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Editor from './Editor'
import { changeSelection } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id],
    editor: (state.editor !== null && state.editor.section === ownProps.id) ? state.editor.index : null,
    selection: state.selection
});
const mapDispatchToProps = dispatch => ({
    changeSelection: id => event => {
        dispatch(changeSelection(id));
        event.stopPropagation();
    }
});

const Paragraph = (id, selection, changeSelection, text) => (
    <p key={id}
       data-selected={id === selection}
       onClick={changeSelection(id)}>
        {text}
    </p>
);

const Section = ({section, editor, selection, changeSelection}) => {
    let pars = section.contents.map(({id, text}) => Paragraph(id, selection, changeSelection, text));
    if (editor !== null) {
        pars.splice(editor, 0, <Editor key="editor"/>);
    }
    return (
        <section data-selected={section.id === selection} onClick={changeSelection(section.id)}>
            <h1>{section.heading}</h1>
            {pars}
            {section.children.map(id => <SectionContainer key={id} id={id}/>)}
        </section>
    );
};

const SectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Section);

SectionContainer.propTypes = {
  id : PropTypes.number.isRequired
};

export default SectionContainer;
