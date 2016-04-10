import React from 'react'
import { connect } from 'react-redux'
import Menu from './NodeMenu'

const mapStateToProps = (state, ownProps) => ({
    heading: state.sections[ownProps.id].heading,
    selected: state.selection !== null && state.selection.section === ownProps.id && state.selection.index === null,
    editing: state.editor !== null && state.editor.section === ownProps.id && state.editor.index === null
});

const Header = ({heading, selected, editing}) => (editing ?
        <header>
            <input type="text" defaultValue={heading} />
        </header>
        :
        <header>
            <h1>{heading}</h1>
            {selected ? <Menu /> : null}
        </header>
);

export default connect(
    mapStateToProps
)(Header);