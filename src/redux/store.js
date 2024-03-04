import { createStore } from 'react-redux';
import authReducer from './auth/authReducer';

const store = createStore(authReducer);

export default store;
