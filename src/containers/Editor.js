import React from 'react'
import { connect } from 'react-redux'
import { publish, closeEditor } from '../actions'

const mapDispatchToProps = (dispatch) => ({
    publish: text => dispatch(publish(text)),
    publishAndClose: text => {
        let publishAction = publish(text);
        if (publishAction != null) {
            dispatch(publishAction);
            dispatch(closeEditor());
        }
    }
});

// NOTE: Editor is a pure react (non-redux) component which uses local state to clear itself.
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.change = this.change.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    change(event) {
        if (event.target.value.endsWith('\n\n')) {
            this.props.publish(event.target.value);
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
    () => ({}),
    mapDispatchToProps
)(Editor);