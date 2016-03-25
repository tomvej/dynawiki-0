import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import initial from './initial';
import wikiApp from './reducers';
import Page from './components/Page';

render(
    <Provider store={createStore(wikiApp, initial)}>
        <Page />
    </Provider>,
    document.getElementById('content')
);