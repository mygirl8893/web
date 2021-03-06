import { combineReducers } from 'redux';
import update from 'immutability-helper';

import constants from 'base/constants';
import { checkChangeUrl } from "base/utils";

const PATH = '/app/create';

const processingCreate = (state=false, action) => {
  if (checkChangeUrl(action, PATH)) {
    return false;
  }
  
  switch (action.type) {
    case constants.COUPON_CREATE_COUPON:
      return true;
    case constants.COUPON_CREATE_COUPON_ERROR:
      return false;
    case constants.COUPON_CREATE_COUPON_SUCCESS:
      return false;
    default:
      return state;
  } 
};

const defaultForm = {
  amount: '',
  currency: 'cnx',
  receiver: '',
  expire_at: '',
  comment: '',
  password: ''
};

const form = (state=defaultForm, action) => {
  if (checkChangeUrl(action, PATH)) {
    return defaultForm;
  }
  
  switch (action.type){
    case constants.COUPON_CREATE_UPDATE_FORM: {
      const { field, value } = action.payload;
      return update(state, {
        [field]: { $set: value }
      });
    }
    case constants.COUPON_CREATE_COUPON_SUCCESS:
      return defaultForm;
    default:
      return state;
  }
};

const defaultValidate = {
  amount: '',
  currency: '',
};

const validateDate = (state=defaultValidate, action) => {
  if (checkChangeUrl(action, PATH)) {
    return defaultValidate;
  }

  switch (action.type){
    case constants.COUPON_CREATE_UPDATE_FORM: {
      const { field, value } = action.payload;
      return update(state, {
        [field]: { $set: '' }
      });
    }
    case constants.COUPON_CREATE_VALIDATE_FORM:
      return update(state, {
        [action.payload.field]: { $set: action.payload.message }
      });
    case constants.COUPON_CREATE_COUPON:
      return defaultValidate;
    default:
      return state;
  }
};

export default combineReducers({
  form,
  processingCreate,
  validateDate
});