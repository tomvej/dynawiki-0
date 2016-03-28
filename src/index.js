import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import initial from './initial'
import wikiApp from './reducers'
import Section from './containers/Section'

render(
    <Provider store={createStore(wikiApp, initial)}>
        <Section id={0} />
    </Provider>,
    document.getElementById('content')
);