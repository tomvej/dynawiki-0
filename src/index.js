import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import initial from './initial'
import wikiApp from './reducers'
import Page from './containers/Page'
import Section from './containers/Section'
import Toolbar from './containers/Toolbar'
import freeze, { deepFreeze } from './middleware/freeze'

import logger from './middleware/logger'
import validator from './middleware/validator'

deepFreeze(initial);
render(
    <Provider store={createStore(wikiApp, initial, applyMiddleware(logger, validator, freeze))}>
        <Page>
            <Toolbar />
            <Section id={0} />
        </Page>
    </Provider>,
    document.getElementById('content')
);