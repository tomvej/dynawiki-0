import { applyMiddleware, compose } from 'redux'

import freeze from './freeze'
import validator from './validator'

export default compose(
    applyMiddleware(validator, freeze),
    window.devToolsExtension ? window.devToolsExtension() : x => x
);