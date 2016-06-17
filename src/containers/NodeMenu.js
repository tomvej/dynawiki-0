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
    constructor(props) {
        super(props);
        this.state = {index: null};
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.createAction = this.createAction.bind(this);
    }
    componentDidMount() {
        window.addEventListener('keypress', this.handleKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress);
    }
    handleKeyPress(event) {
        let index = this.state.index;
        const actions = this.props.actions;
        switch(event.key) {
            case 'Escape':
                this.props.hide();
                break;
            case 'Enter':
                if (index !== null) {
                    actions[index].action(event);
                }
                break;
            case 'ArrowDown':
                index = (index === null || index === actions.length - 1) ? 0 : index + 1;
                this.setState({index});
                break;
            case 'ArrowUp':
                index = (index === null || index === 0) ? actions.length - 1 : index - 1;
                this.setState({index});
                break;
        }
    }

    createAction({name, action}, index) {
        const className = this.state.index === index ? 'selected' : '';
        const setIndex = event => this.setState({index});
        return <a href="" onClick={action} onMouseMove={setIndex} key={index} className={className}>{name}</a>
    }
    render() {
        return <OutsideClickWrapper onOutsideClick={this.props.hide}>
            <span id="node-menu">
                {this.props.actions.map(this.createAction)}
            </span>
        </OutsideClickWrapper>;
    }
}

const ActionProvider = ({onSection, startEditing, appendEditor, startRenaming, deleteSelection, hide}) => {
    const actions = [
        ['Append', appendEditor],
        ['Edit', startEditing],
        onSection && ['Rename', startRenaming],
        ['Delete', deleteSelection]
    ].filter(a => !!a).map(([name, action]) => ({name, action}));
    return <Menu actions={actions} hide={hide}/>;
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActionProvider);