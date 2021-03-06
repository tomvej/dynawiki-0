import React from 'react'
import { connect } from 'react-redux'
import { publish, closeEditor } from '../actions'

const mapStateToProps = (state) => ({
    text: state.editor.text
});

const mapDispatchToProps = (dispatch) => ({
    publish: text => {
        try {
            return dispatch(publish(text));
        } catch (err) {
            alert(err);
        }
    },
    publishAndClose: text => {
        try {
            const publishAction = publish(text);
            if (publishAction) {
                dispatch(publishAction) && dispatch(closeEditor());
            }
        } catch (err) {
            alert(err);
        }
    }
});

// NOTE: Editor is a pure react (non-redux) component which uses local state to clear itself.
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: props.text};
        this.change = this.change.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    change(event) {
        if (event.target.value.endsWith('\n\n') && this.props.publish(event.target.value)) {
            this.setState({value: ''});
        } else {
            this.setState({value: event.target.value});
        }
    }

    keyDown(event) {
        if (event.which === 27) {
            this.props.publishAndClose(event.target.value);
        }
    }

    render() {
        return <textarea rows="10" autoFocus
                         value={this.state.value}
                         onChange={this.change}
                         onKeyDown={this.keyDown}/>;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);