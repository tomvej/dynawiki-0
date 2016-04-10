import React from 'react'
import { connect } from 'react-redux'
import Menu from './NodeMenu'

const mapStateToProps = (state, ownProps) => ({
    section: state.sections[ownProps.id],
    selected: state.selection !== null && state.selection.section === ownProps.id && state.selection.index === null
});

const Header = ({section, selected}) => (
    <header>
        <h1>{section.heading}</h1>
        {selected ? <Menu /> : null}
    </header>
);

export default connect(
    mapStateToProps
)(Header);