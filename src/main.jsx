import React from 'react';
import ReactDOM from 'react-dom';
import { Section } from './section.jsx';

var data = {
    heading: "New Page!",
    contents: [
        {
            type: 'editor'
        }
    ]
};

ReactDOM.render(<Section data={data}/>, document.getElementById('content'));