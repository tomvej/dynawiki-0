import React from 'react'
import { connect } from 'react-redux'

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

const Page = React.createClass({
    componentWillMount() {
        this.insideClick = false;
    },
    componentDidMount() {
        window.addEventListener('mousedown', this.onDocumentClick, false);
        window.addEventListener('keypress', this.props.onKeyPress, false);
    },
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onDocumentClick, false);
        window.removeEventListener('keypress', this.props.onKeyPress, false);
    },

    onDocumentClick() {
        if(!this.insideClick) {
            this.props.clearSelection();
        }
    },
    onMouseDown() {
        this.insideClick = true;
    },
    onMouseUp() {
        this.insideClick = false;
    },

    render() {
        return <div onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
            {this.props.children}
        </div>;
    }
});

export default connect(state => ({}), mapDispatchToProps)(Page);