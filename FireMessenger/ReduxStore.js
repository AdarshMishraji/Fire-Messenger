import { createStore, applyMiddleware } from 'redux';
import ReduxStore from './src/reducers';
import ReduxThunk from 'redux-thunk';

const store = createStore(ReduxStore, {}, applyMiddleware(ReduxThunk));
export default store;