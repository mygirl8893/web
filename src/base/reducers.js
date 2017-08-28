import { combineReducers } from 'redux';
import { routerReducer} from 'react-router-redux';


import users from 'users/reducers';
import transactions from 'transactions/reducers';
import withdraw from 'withdraw/reducers'

export default combineReducers({
  router: routerReducer,
  users,
  transactions,
  withdraw
})