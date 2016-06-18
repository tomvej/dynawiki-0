import React from 'react'
import { connect } from 'react-redux'

import OutsideClickWrapper from '../components/OutsideClickWrapper'
import { clearSelection, startSelection, popup } from '../actions'
import { moveSelectionDown, moveSelectionUp, moveSelectionToParent } from '../actions/moveSelection'

const handleKeyPress = dispatch => event => {
    switch (event.key) {
        case ' ':
            dispatch(startSelection());
            break;
        case 'Escape':
            dispatch(clearSelection());
            break;
        case 'ArrowUp':
            dispatch(moveSelectionUp());
            break;
        case 'ArrowDown':
            dispatch(moveSelectionDown());
            break;
        case 'ArrowLeft':
            dispatch(moveSelectionToParent());
            break;
    }
};

const mapDispatchToProps = dispatch => ({
    clearSelection: () => dispatch(clearSelection()),
    onKeyPress: handleKeyPress(dispatch),
    contextMenu: event => {
        event.preventDefault();
        if (event.buttons === 0) {
            dispatch(popup(true));
        }
    }
});

class Page extends React.Component {
    componentDidMount() {
        window.addEventListener('keypress', this.props.onKeyPress, false);
        window.addEventListener('contextmenu', this.props.contextMenu);
    }
    componentWillUnmount() {
        window.removeEventListener('keypress', this.props.onKeyPress, false);
        window.removeEventListener('contextnenu', this.props.contextMenu);
    }
    render() {
        return <OutsideClickWrapper onOutsideClick={this.props.clearSelection}>
            {this.props.children}
        </OutsideClickWrapper>;
    }
}

export default connect(state => ({}), mapDispatchToProps)(Page);