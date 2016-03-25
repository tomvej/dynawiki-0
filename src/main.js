import React from 'react';
import ReactDOM from 'react-dom';
import { Page } from './page';

var data = {
    type: 'section',
    heading: 'New Page!',
    contents: [
        {
            type: 'editor'
        }
    ]
};

ReactDOM.render(<Page data={data}/>, document.getElementById('content'));