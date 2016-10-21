/**
 * Created by aston on 14/08/2016.
 */

import { createStore, applyMiddleware } from 'redux'
import { myApplication } from './reducers'
import thunk from 'redux-thunk';

export default store = createStore(myApplication, applyMiddleware(thunk));