import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import initial from './initial'
import wikiApp from './reducers'
import Section from './containers/Section'
import logger from './middleware/logger'
import validator from './middleware/validator'

render(
    <Provider store={createStore(wikiApp, initial, applyMiddleware(logger, validator))}>
        <Section id={0} />
    </Provider>,
    document.getElementById('content')
);