import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Editor from './Editor'
import NodeMenu from './NodeMenu'
import Header from './Header'
import { changeSelection, showPopup } from '../actions'

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id],
    editor: (state.editor !== null && state.editor.section === ownProps.id) ? state.editor.index : null,
    selection: state.selection
});
const mapDispatchToProps = dispatch => ({
    changeSelection: (section, index) => event => {
        dispatch(changeSelection(section, index));
        event.stopPropagation();
    },
    showPopup: (section, index) => event => {
        dispatch(changeSelection(section, index));
        dispatch(showPopup(event.pageX, event.pageY));
        event.preventDefault();
        event.stopPropagation();
    }
});

const Paragraph = (id, selected, changeSelection, text, showPopup) => (
    <p key={id}
       onClick={changeSelection}
       onContextMenu={showPopup}>
        {selected ? <span id="selection"/> : null}
        {selected ? <NodeMenu /> : null}
        {text}
    </p>
);

const Section = ({section, editor, selection, changeSelection, showPopup}) => {
    let selected = selection !== null && section.id === selection.section && selection.index === null;
    let parSelected = index => (selection !== null && section.id === selection.section && index === selection.index);
    let pars = section.contents.map(({id, text}, index) => Paragraph(id, parSelected(index), changeSelection(section.id, index), text, showPopup(section.id, index)));
    if (editor !== null) {
        pars.splice(editor, 0, <Editor key="editor"/>);
    }
    return (
        <section onClick={changeSelection(section.id, null)} onContextMenu={showPopup(section.id, null)}>
            {selected ? <span id="selection" /> : null}
            {selected ? <NodeMenu /> : null}
            <Header id={section.id}/>
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
