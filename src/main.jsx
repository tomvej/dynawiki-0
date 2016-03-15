import React from 'react';
import ReactDOM from 'react-dom';
import { Page } from './page.jsx';

var data = {
    heading: "New Page!",
    contents: [
        {
            type: 'editor'
        }
    ]
};

ReactDOM.render(<Page data={data}/>, document.getElementById('content'));