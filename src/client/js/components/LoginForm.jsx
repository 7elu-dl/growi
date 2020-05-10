import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isRegistering: false,
    };

    this.isRegistrationEnabled = false;
    this.registrationMode = 'Closed';
    this.registrationWhiteList = [];
    this.isLocalStrategySetup = false;
    this.isLdapStrategySetup = false;
    this.objOfIsExternalAuthEnableds = {};

    this.onClickSwitchFormBtn = this.onClickSwitchFormBtn.bind(this);
    this.renderLocalOrLdapLoginForm = this.renderLocalOrLdapLoginForm.bind(this);
    this.renderExternalAuthLoginForm = this.renderExternalAuthLoginForm.bind(this);
    this.renderExternalAuthInput = this.renderExternalAuthInput.bind(this);
    this.renderRegisterForm = this.renderRegisterForm.bind(this);
  }

  componentWillMount() {
    // [TODO][GW-1913] get params from server with axios
    this.isRegistrationEnabled = true;
    this.registrationMode = 'Open';
    this.registrationWhiteList = [];
    this.isLocalStrategySetup = true;
    this.isLdapStrategySetup = true;
    this.objOfIsExternalAuthEnableds = {
      google: true,
      github: true,
      facebook: true,
      twitter: true,
      oidc: true,
      saml: true,
      basic: true,
    };
  }

  componentDidMount() {
    const { hash } = window.location;
    if (hash === '#register') {
      this.setState({ isRegistering: true });
    }
  }

  onClickSwitchFormBtn() {
    this.setState({ isRegistering: !this.state.isRegistering });
  }

  renderLocalOrLdapLoginForm() {
    const { t, csrf, isLdapStrategySetup } = this.props;

    return (
      <form role="form" action="/login" method="post">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="icon-user"></i>
            </span>
          </div>
          <input type="text" className="form-control" placeholder="Username or E-mail" name="loginForm[username]" />
          {isLdapStrategySetup && (
            <div className="input-group-append">
              <small className="input-group-text text-success">
                <i className="icon-fw icon-check"></i> LDAP
              </small>
            </div>
          )}
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="icon-lock"></i>
            </span>
          </div>
          <input type="password" className="form-control" placeholder="Password" name="loginForm[password]" />
        </div>

        <div className="input-group justify-content-center d-flex mt-5">
          {/* [TODO][GW-2112] An AppContainer gets csrf data */}
          <input type="hidden" name="_csrf" value={csrf} />
          <button type="submit" id="login" className="btn btn-fill login px-0 py-2">
            <div className="eff"></div>
            <span className="btn-label p-3">
              <i className="icon-login"></i>
            </span>
            <span className="btn-label-text p-3">{t('Sign in')}</span>
          </button>
        </div>
      </form>
    );
  }

  renderExternalAuthInput(auth) {
    const { t, csrf } = this.props;
    return (
      <div key={auth} className="input-group justify-content-center d-flex mt-5">
        {/* [TODO][GW-2112] use onClick, and delete form tag */}
        <form role="form" action={`/passport/${auth}`} className="d-inline-flex flex-column">
          {/* [TODO][GW-2112] An AppContainer gets csrf data */}
          <input type="hidden" name="_csrf" value={csrf} />
          <button type="submit" className="btn btn-fill px-0 py-2" id={auth}>
            <div className="eff"></div>
            <span className="btn-label p-3">
              <i className={`fa fa-${auth}`}></i>
            </span>
            <span className="btn-label-text p-3">{t('Sign in')}</span>
          </button>
          <div className="small text-center">by {auth} Account</div>
        </form>
      </div>
    );
  }

  renderExternalAuthLoginForm() {
    const { isLocalStrategySetup, isLdapStrategySetup, objOfIsExternalAuthEnableds } = this.props;
    const isExternalAuthCollapsible = isLocalStrategySetup || isLdapStrategySetup;
    const collapsibleClass = isExternalAuthCollapsible ? 'collapse collapse-external-auth collapse-anchor' : '';

    return (
      <>
        <div className="border-bottom"></div>
        <div id="external-auth" className={`external-auth ${collapsibleClass}`}>
          <div className="spacer"></div>
          <div className="d-flex flex-row justify-content-between flex-wrap">
            {Object.keys(objOfIsExternalAuthEnableds).map((auth) => {
              if (!objOfIsExternalAuthEnableds[auth]) {
                return;
              }
              return this.renderExternalAuthInput(auth);
            })}
          </div>
          <div className="spacer"></div>
        </div>
        <div className="border-bottom"></div>
        <div className="text-center">
          <button
            type="button"
            className="collapse-anchor btn btn-xs btn-collapse-external-auth mb-3"
            data-toggle={isExternalAuthCollapsible ? 'collapse' : ''}
            data-target="#external-auth"
            aria-expanded="false"
            aria-controls="external-auth"
          >
            External Auth
          </button>
        </div>
      </>
    );
  }

  renderRegisterForm() {
    const {
      t,
      csrf,
      registrationMode,
      registrationWhiteList,
    } = this.props;

    return (
      <div className="back">
        {registrationMode === 'Restricted' && (
          <p className="alert alert-warning">
            {t('page_register.notice.restricted')}
            <br />
            {t('page_register.notice.restricted_defail')}
          </p>
        )}
        <form role="form" action="/register" method="post" id="register-form">
          <div className="input-group" id="input-group-username">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="icon-user"></i>
              </span>
            </div>
            <input type="text" className="form-control" placeholder={t('User ID')} name="registerForm[username]" defaultValue={this.props.username} required />
          </div>
          <p className="form-text text-danger">
            <span id="help-block-username"></span>
          </p>

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="icon-tag"></i>
              </span>
            </div>
            <input type="text" className="form-control" placeholder={t('Name')} name="registerForm[name]" defaultValue={this.props.name} required />
          </div>

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="icon-envelope"></i>
              </span>
            </div>
            <input type="email" className="form-control" placeholder={t('Email')} name="registerForm[email]" defaultValue={this.props.email} required />
          </div>

          {registrationWhiteList.length > 0 && (
            <>
              <p className="form-text">{t('page_register.form_help.email')}</p>
              <ul>
                {registrationWhiteList.map((elem) => {
                  return (
                    <li key={elem}>
                      <code>{elem}</code>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="icon-lock"></i>
              </span>
            </div>
            <input type="password" className="form-control" placeholder={t('Password')} name="registerForm[password]" required />
          </div>

          <div className="input-group justify-content-center mt-5">
            {/* [TODO][GW-2112] An AppContainer gets csrf data */}
            <input type="hidden" name="_csrf" value={csrf} />
            <button type="submit" className="btn btn-fill px-0 py-2" id="register">
              <div className="eff"></div>
              <span className="btn-label p-3">
                <i className="icon-user-follow"></i>
              </span>
              <span className="btn-label-text p-3">{t('Sign up')}</span>
            </button>
          </div>
        </form>

        <div className="border-bottom mb-3"></div>

        <div className="row">
          <div className="text-right col-12 py-1">
            <a href="#login" id="login" className="link-switch" onClick={this.onClickSwitchFormBtn}>
              <i className="icon-fw icon-login"></i>
              {t('Sign in is here')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      t,
      isRegistering,
      isLocalStrategySetup,
      isLdapStrategySetup,
      isRegistrationEnabled,
      objOfIsExternalAuthEnableds,
    } = this.props;

    const isLocalOrLdapStrategiesEnabled = isLocalStrategySetup || isLdapStrategySetup;
    const registerFormClass = isRegistering ? 'to-flip' : '';
    const isSomeExternalAuthEnabled = Object.values(objOfIsExternalAuthEnableds).some(elem => elem);

    return (
      <div className={`login-dialog mx-auto flipper ${registerFormClass}`} id="login-dialog">
        <div className="row mx-0">
          <div className="col-12">
            <div className="front">
              {isLocalOrLdapStrategiesEnabled && this.renderLocalOrLdapLoginForm()}
              {isSomeExternalAuthEnabled && this.renderExternalAuthLoginForm()}
              {isRegistrationEnabled && (
                <div className="row">
                  <div className="col-12 text-right py-2">
                    <a href="#register" id="register" className="link-switch" onClick={this.onClickSwitchFormBtn}>
                      <i className="ti-check-box"></i> {t('Sign up is here')}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {isRegistrationEnabled && this.renderRegisterForm()}
            <a href="https://growi.org" className="link-growi-org pl-3">
              <span className="growi">GROWI</span>.<span className="org">ORG</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

}

LoginForm.propTypes = {
  // i18next
  t: PropTypes.func.isRequired,
  username: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  csrf: PropTypes.string,
  isRegistrationEnabled: PropTypes.bool,
  registrationMode: PropTypes.string,
  registrationWhiteList: PropTypes.array,
  isLocalStrategySetup: PropTypes.bool,
  isLdapStrategySetup: PropTypes.bool,
  objOfIsExternalAuthEnableds: PropTypes.object,
};

export default withTranslation()(LoginForm);
