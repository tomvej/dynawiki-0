import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import './page.less'

import initial from './text'
import wikiApp from './reducers'
import Page from './containers/Page'
import Section from './containers/Section'
import Toolbar from './containers/Toolbar'
import { deepFreeze } from './middleware/freeze'

import middleware from './middleware'

deepFreeze(initial);
render(
    <Provider store={createStore(wikiApp, initial, middleware)}>
        <Page>
            <Toolbar />
            <Section id={0} />
        </Page>
    </Provider>,
    document.getElementById('content')
);