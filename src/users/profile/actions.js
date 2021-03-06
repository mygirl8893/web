import constants from 'base/constants';
import { getData } from 'base/settings';
import { fetchListCurrency } from "api/payment";
import { generateArrayConst } from "base/utils";

let result = {
  info: (response, dispatch) => {
    return response.json().then( json => {
      if (json.error) {
        localStorage.removeItem('profile');
        return dispatch({
          type: constants.USERS_PROFILE_FETCH_INFO_ERROR,
          payload: {
            code: json.error.code
          }
        });
      }

      let initState = {
        is_active: true,
        info: json.result,
        code: 'undefined',
      };
      dispatch(getWallets());
      dispatch(fetchRates());
      localStorage.setItem('profile', JSON.stringify(initState));

      return dispatch({
        type: constants.USERS_PROFILE_FETCH_INFO_SUCCESS,
        payload: {
          profile: JSON.parse(localStorage.getItem('profile'))
        }
      });

    });
  },
  wallets: (response, dispatch) => {
    return response.json().then( json => {

      if (json.error) {
        return dispatch({
          type: constants.USERS_PROFILE_FETCH_LIST_WALLET_ERROR,
          payload: {
            code: json.error.code
          }
        });
      }
      let cnx = json.result.accounts.filter(item => item.currency == "cnx")[0] || {balance: '', currency: '', hash: ''};
      return dispatch({
        type: constants.USERS_PROFILE_FETCH_LIST_WALLET_SUCCESS,
        payload: {
          wallets: json.result.accounts,
          cnx
        }
      });
    });
  },
  logout: (response, dispatch) => {
    return response.json().then( json => {
      if (json.error) {

        return dispatch({
          type: constants.USERS_PROFILE_LOGOUT_ERROR,
          payload: json.error
        });
      }


      return dispatch({
        type: constants.USERS_PROFILE_LOGOUT_SUCCESS,
      });
    });
  }
};

export let getInfo = () => {
  return dispatch => {

    if (!localStorage.ticket) {
      localStorage.removeItem('profile');
      return dispatch({
        type: constants.USERS_PROFILE_FETCH_INFO_ERROR,
        payload: {
          error: 'undefined'
        }
      });
    }


    let params = {
      'ticket' : localStorage.getItem('ticket')
    };

    dispatch({type: constants.USERS_PROFILE_FETCH_INFO});
    return getData(2, params, 'user.info').then( response => {
      if (response.ok) {
        result.info(response, dispatch);
      } else {
        return response.json().then( json => {
          return dispatch({
            type: constants.USERS_PROFILE_FETCH_INFO_ERROR,
            payload: json
          });
        });
      }
    }).catch( error => {
      dispatch({type: constants.USERS_PROFILE_FETCH_INFO_NETWORK_ERROR});
    });
  }
};

export let getWallets = () => {
  return dispatch => {

    let params = {
      'ticket' : localStorage.getItem('ticket')
    };

    dispatch({type: constants.USERS_PROFILE_FETCH_LIST_WALLET});

    return getData(2, params, 'user.account_list').then( response => {
      if (response.ok) {
        result.wallets(response, dispatch);
      } else {
        return response.json().then( json => {
          return dispatch({
            type: constants.USERS_PROFILE_FETCH_LIST_WALLET_ERROR,
            payload: json
          });
        });
      }
    }).catch( error => {
      dispatch({type: constants.USERS_PROFILE_FETCH_LIST_WALLET_ERROR});
    });
  }
};

export let logout =() => {
  return dispatch => {
    let params = {
      'ticket' : localStorage.getItem('ticket')
    };

    localStorage.removeItem('ticket');
    localStorage.removeItem('profile');

    return getData(4, params, 'user.logout').then(response =>{
      if (response.ok){
        result.logout(response, dispatch);
      } else {
        return response.json().then(json => {
          return dispatch({
            type: constants.USERS_PROFILE_LOGOUT_ERROR,
            payload: json
          });
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }
};


const resultFetchRates = (response, dispatch) => {
  return response.json().then( json => {
    if (json.error) {
      return dispatch({
        type: constants.USERS_PROFILE_FETCH_LIST_RATES_ERROR,
        payload: json
      });
    }


    return dispatch({
      type: constants.USERS_PROFILE_FETCH_LIST_RATES_SUCCESS,
      payload: {
        rates: json.result.rates
      }
    });

  });
};

export let fetchRates = () => {
  return dispatch => {

    let params = {
      ticket: localStorage.getItem('ticket'),
    };

    dispatch({type: constants.USERS_PROFILE_FETCH_LIST_RATES});
    return getData(2, params, 'currency_pair.get_rate_list').then( response => {
      if (response.ok) {
        resultFetchRates(response, dispatch);
      } else {
        return response.json().then( json => {
          dispatch({type: constants.USERS_PROFILE_FETCH_LIST_RATES_ERROR});
        });
      }
    }).catch( error => {
      dispatch({type: constants.USERS_PROFILE_FETCH_INFO_NETWORK_ERROR});
    });
  }
};

export const loadlListCurrency = () => {

  return {
    type: 'PROMISE',
    payload: {
      actions: generateArrayConst(constants.FETCH_LIST_CURRENCY),
      response: fetchListCurrency(),
      handlerData: (data) => {
        return data.currencies;
      }
    },
  };
};


