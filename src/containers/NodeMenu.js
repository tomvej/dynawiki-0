import React from 'react'

import { connect } from 'react-redux'
import { startEditing, appendEditor, startRenaming, deleteSelection, popup } from '../actions'
import OutsideClickWrapper from './util/OutsideClickWrapper'

const mapStateToProps = state => ({
    onSection: state.selection.index === null
});

const catchAction = (dispatch, generator) => event => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(popup(false));
    dispatch(generator(event));
};

const mapDispatchToProps = dispatch => ({
    startEditing: catchAction(dispatch, startEditing),
    appendEditor: catchAction(dispatch, appendEditor),
    startRenaming: catchAction(dispatch, startRenaming),
    deleteSelection: catchAction(dispatch, deleteSelection),
    hide: () => {dispatch(popup(false));}
});

class Menu extends React.Component {
    render() {
        const createAction = ({name, action}, index) => <a href="" onMouseDown={action} key={index}>{name}</a>;
        return <OutsideClickWrapper onOutsideClck={this.props.hide}>
            <span id="node-menu">
                {this.props.actions.map(createAction)}
            </span>
        </OutsideClickWrapper>;
    }
}

const ActionProvider = ({onSection, startEditing, appendEditor, startRenaming, deleteSelection, hide}) => {
    const action = (name, action) => ({name, action});
    const actions = [];
    actions.push(action('Append', appendEditor));
    actions.push(action('Edit', startEditing));
    onSection && actions.push(action('Rename', startRenaming));
    actions.push(action('Delete', deleteSelection));
    return <Menu actions={actions} hide={hide}/>;
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActionProvider);