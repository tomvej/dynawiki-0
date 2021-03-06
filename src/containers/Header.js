import React from 'react'
import { connect } from 'react-redux'

import { rename } from '../actions'

const mapDispatchToProps = dispatch => ({
    rename: event => {
        if (event.which === 27 || event.which === 13) {
            dispatch(rename(event.target.value));
        }
    }
});

const mapStateToProps = (state, ownProps) => ({
    heading: state.sections[ownProps.id].heading,
    selected: state.selection !== null && state.selection.section === ownProps.id && state.selection.index === null,
    editing: state.editor !== null && state.editor.section === ownProps.id && state.editor.index === null
});

const Header = ({heading, selected, editing, rename}) => (
    <header>
        { editing
            ? <textarea rows="1" defaultValue={heading} onKeyDown={rename} autoFocus/>
            : <h1>{heading}</h1>
        }
    </header>
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);