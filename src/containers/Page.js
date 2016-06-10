import React from 'react'
import { connect } from 'react-redux'

import { clearSelection, startSelection } from '../actions'
import { moveSelectionDown, moveSelectionUp, moveSelectionToParent } from '../actions/moveSelection'

import Popup from './NodePopup'

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

const mapStateToProps = state => ({
    popupDisplayed: !!state.popup && state.popup.x && state.popup.y
});

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
            {this.props.popupDisplayed ? <Popup/> : null}
        </div>;
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);