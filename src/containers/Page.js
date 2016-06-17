import React from 'react'
import { connect } from 'react-redux'

import OutsideClickWrapper from '../components/OutsideClickWrapper'
import { clearSelection, startSelection } from '../actions'
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
    onKeyPress: handleKeyPress(dispatch)
});

class Page extends React.Component {
    componentDidMount() {
        window.addEventListener('keypress', this.props.onKeyPress, false);
    }
    componentWillUnmount() {
        window.removeEventListener('keypress', this.props.onKeyPress, false);
    }
    render() {
        return <OutsideClickWrapper onOutsideClick={this.props.clearSelection}>
            {this.props.children}
        </OutsideClickWrapper>;
    }
}

export default connect(state => ({}), mapDispatchToProps)(Page);