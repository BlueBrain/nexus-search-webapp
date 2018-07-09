import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk'
import history from '../../libs/history';


const testMiddleware = store => next => action => {
  console.log("myFakeMiddleware: ", action.type)
  next(action);
}

const middleware = [ thunk, routerMiddleware(history), testMiddleware ]


export default middleware;