import React from 'react';
import ReactDOM from 'react-dom';

class Section extends React.Component {
    render() {
        return <h1>New Page</h1>;
    }
}

ReactDOM.render(<Section/>, document.getElementById('content'));