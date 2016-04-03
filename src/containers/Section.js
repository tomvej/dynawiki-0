import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Editor from './Editor'
import NodeMenu from './NodeMenu'
import { changeSelection } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id],
    editor: (state.editor !== null && state.editor.section === ownProps.id) ? state.editor.index : null,
    selection: state.selection
});
const mapDispatchToProps = dispatch => ({
    changeSelection: (section, index) => event => {
        dispatch(changeSelection(section, index));
        event.stopPropagation();
    }
});

const Paragraph = (id, selected, changeSelection, text) => (
    <p key={id}
       data-selected={selected}
       onClick={changeSelection}>
        {selected ? <NodeMenu /> : null}
        {text}
    </p>
);

const Section = ({section, editor, selection, changeSelection}) => {
    let selected = selection !== null && section.id === selection.section && selection.index === null;
    let parSelected = index => (selection !== null && section.id === selection.section && index === selection.index);
    let pars = section.contents.map(({id, text}, index) => Paragraph(id, parSelected(index), changeSelection(section.id, index), text));
    if (editor !== null) {
        pars.splice(editor, 0, <Editor key="editor"/>);
    }
    return (
        <section data-selected={selected} onClick={changeSelection(section.id, null)}>
            <header><h1>{section.heading}</h1>{selected ? <NodeMenu/> : null}</header>
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
