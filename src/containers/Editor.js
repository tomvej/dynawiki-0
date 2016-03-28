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

const Editor = ({publish, publishAndClose}) => {
    let change = event => {
        if (event.target.value.endsWith('\n\n')) {
            publish(event.target.value);
        }
    };
    let keyDown = event => {
        if (event.which === 27) {
            publishAndClose(event.target.value);
        }
    };
    return (
        <textarea rows="10" autoFocus
                  onChange={change}
                  onKeyDown={keyDown} />
    );
};

export default connect(
    () => ({}),
    mapDispatchToProps
)(Editor);