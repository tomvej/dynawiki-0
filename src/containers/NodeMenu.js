import React from 'react'
import { connect } from 'react-redux'
import { startEditing, appendEditor, startRenaming, deleteSelection } from '../actions'

const mapStateToProps = state => ({
    onSection: state.selection.index === null
});

const catchAction = (dispatch, generator) => event => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(generator(event));
};

const mapDispatchToProps = dispatch => ({
    startEditing: catchAction(dispatch, startEditing),
    appendEditor: catchAction(dispatch, appendEditor),
    startRenaming: catchAction(dispatch, startRenaming),
    deleteSelection: catchAction(dispatch, deleteSelection)
});

const Menu = React.createClass({
    render() {
        return <span id="node-menu">
            <a href="" onClick={this.props.appendEditor}>Append</a>
            <a href="" onClick={this.props.startEditing}>Edit</a>
            {this.props.onSection && <a href="" onClick={this.props.startRenaming}>Rename</a>}
            <a href="" onClick={this.props.deleteSelection}>Delete</a>
        </span>;
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu)