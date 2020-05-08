import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.isRegistrationEnabled = false;
    this.registrationMode = 'Closed';
    this.registrationWhiteList = [];
    this.isLocalStrategySetup = false;
    this.isLdapStrategySetup = false;
    this.objOfIsExternalAuthEnableds = {};

    this.switchForm = this.switchForm.bind(this);
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

  // for flip [TODO][GW-1865] use state or react component for flip
  switchForm(e) {
    if (e.target.id === 'register') {
      $('#login-dialog').addClass('to-flip');
    }
    else {
      $('#login-dialog').removeClass('to-flip');
    }
  }

  renderLocalOrLdapLoginForm() {
    const { t, csrf } = this.props;

    return (
      <form role="form" action="/login" method="post">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="icon-user"></i>
            </span>
          </div>
          <input type="text" className="form-control" placeholder="Username or E-mail" name="loginForm[username]" />
          {this.isLdapStrategySetup && (
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
          {/* [TODO][GW-1913] An AppContainer gets csrf data */}
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
      <div className="col-6">
        {/* [TODO][GW-1913] use onClick, and delete form tag */}
        <form key={auth} role="form" action={`/passport/${auth}`}>
          {/* [TODO][GW-1913] An AppContainer gets csrf data */}
          <input type="hidden" name="_csrf" value={csrf} />
          <button type="submit" className="btn btn-fill w-100" id={auth}>
            <div className="eff"></div>
            <span className="btn-label">
              <i className={`fa fa-${auth}`}></i>
            </span>
            <span className="btn-label-text">{t('Sign in')}</span>
          </button>
          <div className="small text-right">by {auth} Account</div>
        </form>
      </div>
    );
  }

  renderExternalAuthLoginForm() {
    const isExternalAuthCollapsible = this.isLocalStrategySetup || this.isLdapStrategySetup;
    const collapsibleClass = isExternalAuthCollapsible ? 'collapse collapse-external-auth collapse-anchor' : '';

    return (
      <>
        <div className="border-bottom"></div>
        <div id="external-auth" className={`external-auth ${collapsibleClass}`}>
          <div className="row my-2">
            {Object.keys(this.objOfIsExternalAuthEnableds).map((auth) => {
              if (!this.objOfIsExternalAuthEnableds[auth]) {
                return;
              }
              return this.renderExternalAuthInput(auth);
            })}
          </div>
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
    const { t, csrf } = this.props;
    return (
      <div className="back">
        {this.registrationMode === 'Restricted' && (
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

          {this.registrationWhiteList.length > 0 && (
            <>
              <p className="form-text">{t('page_register.form_help.email')}</p>
              <ul>
                {this.registrationWhiteList.map((elem) => {
                  return (
                    <li>
                      <code>{{ elem }}</code>
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
            {/* [TODO][GW-1913] An AppContainer gets csrf data */}
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
            <a href="#login" id="login" className="link-switch" onClick={this.handleClick}>
              <i className="icon-fw icon-login"></i>
              {t('Sign in is here')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { t, isRegistering } = this.props;

    const isLocalOrLdapStrategiesEnabled = this.isLocalStrategySetup || this.isLdapStrategySetup;
    const registerFormClass = isRegistering ? 'to-flip' : '';
    const isSomeExternalAuthEnabled = Object.values(this.objOfIsExternalAuthEnableds).some(elem => elem);

    return (
      <div className={`login-dialog mx-auto flipper ${registerFormClass}`} id="login-dialog">
        <div className="row mx-0">
          <div className="col-12">
            <div className="front">
              {isLocalOrLdapStrategiesEnabled && this.renderLocalOrLdapLoginForm()}
              {isSomeExternalAuthEnabled && this.renderExternalAuthLoginForm()}
              {this.isRegistrationEnabled && (
                <div className="row">
                  <div className="col-12 text-right py-2">
                    <a href="#register" id="register" className="link-switch" onClick={this.switchForm}>
                      <i className="ti-check-box"></i> {t('Sign up is here')}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {this.isRegistrationEnabled && this.renderRegisterForm()}
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
  isRegistering: PropTypes.bool,
  username: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  csrf: PropTypes.string,
};

export default withTranslation()(LoginForm);
