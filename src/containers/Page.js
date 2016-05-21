import React from 'react'
import { connect } from 'react-redux'

import { clearSelection } from '../actions'

const mapDispatchToProps = dispatch => ({
    clearSelection: () => dispatch(clearSelection())
});

const Page = React.createClass({
    componentWillMount() {
        this.insideClick = false;
    },
    componentDidMount() {
        window.addEventListener('mousedown', this.onDocumentClick, false);
        window.addEventListener('keypress', this.onKeyPress, false);
    },
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onDocumentClick, false);
        window.removeEventListener('keypress', this.onKeyPress, false);
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
    onKeyPress(event) {
    },

    render() {
        return <div onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
            {this.props.children}
        </div>;
    }
});

export default connect(state => ({}), mapDispatchToProps)(Page);