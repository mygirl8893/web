import React, { Component } from 'react';
import Processing from 'elements/processing';
import CN from 'classnames';
import { translate } from "../base/utils";


let fields = [
  {name: 'amount', title: 'form.amount'},
  {name: 'to_hash', title: 'form.send_to'},
];

const freeText = {
  cnx: 'fee.cnx',
  btc: 'fee.btc',
  eth: 'fee.eth'
};

class Withdraw extends Component {

  componentDidMount() {
    const { dispatch, walletCnx } = this.props;
    dispatch({
      type: 'INIT_WITHDRAW',
      payload: {
        hash: walletCnx.hash
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({type: 'WITHDRAW_LEAVE_PAGE'});
  }

  render() {
    const { updateForm, submit, error, form, processing, walletCnx, userInfo, wallets, currency } = this.props;
    let classNameError = CN({
      'withdraw__container-form__item': true,
      'half': true,
      'success': 'Success!' == error,
      'error': error && 'Success!' != error
    });

    const wallet = wallets.filter((item => item.hash === form.from_hash ))[0];
    const free = (typeof wallet !== 'undefined' && wallet !== null) ? wallet.currency: 'cnx';
    return(
      <div className="withdraw">
        <div className="withdraw__container">
          {processing ? <Processing/>: null}
          <div className="content">
{/*            <div className="row">
              <div className="col-md-9 offset-md-2">
                <div className="default__info">
                  <div className="withdraw__info">
                    <h5>
                      You have: {walletCnx.balance} CNX
                    </h5>
                  </div>
                  <div className="withdraw__info-text">
                    You can transfer CNX to your Cryptonex wallet (wallet for <a href="https://github.com/Cryptonex/release/raw/master/cryptonex-win.zip"> Windows</a>,
                    wallet for <a href="https://github.com/Cryptonex/release/raw/master/cryptonex-linux.tar.gz"> Linux</a>),
                    for example, to get a reward from P-o-S mining. You can also withdraw coins to any
                    Cryptonex address. With 2FA enabled, you will be asked to enter your 2FA
                    code when placing withdrawals.
                  </div>
                </div>
              </div>
            </div>*/}
            <div className="row">
              <div className="col-md-12">
                <p style={{marginBottom: '20px'}}>
                  {translate('page.choose_withdraw_type')}
                </p>
              </div>
              <div className="col-md-12">
                <div className="replenishment__payments-buttons">
                  {[...wallets].reverse().map((item, index) => {
                    if (item.currency !== 'cnx' && item.currency !== 'eth' && item.currency !== 'btc') {
                      return null;
                    }

                    return (
                      <a className={CN({active: item.hash === form.from_hash})} key={item.hash} onClick={(e) => updateForm('from_hash', item.hash)}>
                        {(item.currency === 'cnx') ? <img src={require('assets/images/Big-button_Cryptonex.png')} alt=""/>:
                          (item.currency === 'btc') ? <img src={require('assets/images/Big-button_Bitcoin.png')} alt=""/>:
                            <img src={require('assets/images/Big-button_Ethereum.png')} alt=""/>
                        }
                      </a>
                    )
                  })}
                </div>
              </div>
              <div className="col-md-9 offset-md-2">
                <div className="withdraw__container-form default__info">
                  <p style={{fontSize: '0.9rem', marginBottom: '20px'}}>{translate(freeText[free])}</p>
                  {fields.map((item, index) =>
                    <div className="withdraw__container-form__item" key={index}>
                      <label className="form-label">{translate(item.title)}</label>
                      <input type="text" className="form form-full__width"
                             onChange={e => updateForm(item.name, e.target.value)}/>
                    </div>
                  )}
                  { userInfo.auth_2fa ?
                    <div className="withdraw__container-form__item">
                      <label className="form-label">Enter the 6-digit code by Google Authenticator:</label>
                      <input type="text" className="form form-full__width"
                             onChange={e => updateForm('auth_2fa_code', e.target.value)}/>

                    </div>: null }

                  <div className="withdraw__container-form__item">
                    <div className={classNameError}>
                      {error == 'Success!' && userInfo.auth_2fa ? 'Success!':
                        error != 'Success!' ? error: 'Check your e-mail for confirming of transaction.'}
                    </div>
                    <div className="withdraw__container-form__item-button">
                      <a className="button button-cover primary small"
                         onClick={e => submit(form, userInfo.auth_2fa)}>{translate('action.send')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Withdraw;
