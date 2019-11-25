import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from '../../UnstatedUtils';

import AppContainer from '../../../services/AppContainer';
import AdminGeneralSecurityContainer from '../../../services/AdminGeneralSecurityContainer';
import AdminLdapSecurityContainer from '../../../services/AdminLdapSecurityContainer';

class SecurityLdapSetting extends React.Component {

  render() {
    const { t, adminGeneralSecurityContainer, adminLdapSecurityContainer } = this.props;
    const { isLdapConfigEnabled } = adminGeneralSecurityContainer.state;

    return (
      <React.Fragment>

        <h2 className="alert-anchor border-bottom">
          LDAP { t('security_setting.configuration') }
        </h2>

        <div className="row mb-5">
          <strong className="col-xs-3 text-right">Use LDAP</strong>
          <div className="col-xs-6 text-left">
            <div className="checkbox checkbox-success">
              <input
                id="isLdapEnabled"
                type="checkbox"
                checked={isLdapConfigEnabled}
                onChange={() => { adminGeneralSecurityContainer.switchIsLdapEnabled() }}
              />
              <label htmlFor="isLdapEnabled">
                { t('security_setting.ldap.enable_ldap') }
              </label>
            </div>
          </div>
        </div>


        {isLdapConfigEnabled && (
          <React.Fragment>
            <div className="row mb-5">
              <label htmlFor="serverUrl" className="col-xs-3 control-label text-right">Server URL</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="serverUrl"
                  value={adminLdapSecurityContainer.state.serverUrl}
                  onChange={e => adminLdapSecurityContainer.changeServerUrl(e.target.value)}
                />
                <small>
                  <p
                    className="help-block"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.server_url_detail') }}
                  />
                  { t('security_setting.example') }: <code>ldaps://ldap.company.com/ou=people,dc=company,dc=com</code>
                </small>
              </div>
            </div>

            <div className="row mb-5">
              <strong className="col-xs-3 text-right">{ t('security_setting.ldap.bind_mode') }</strong>
              <div className="col-xs-6 text-left">
                <div className="my-0 btn-group">
                  <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle w-100" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span className="pull-left">{t(`security_setting.ldap.bind_${adminLdapSecurityContainer.state.bindMode}`)}</span>
                      <span className="bs-caret pull-right">
                        <span className="caret" />
                      </span>
                    </button>
                    {/* TODO adjust dropdown after BS4 */}
                    <ul className="dropdown-menu" role="menu">
                      <li key="manager" role="presentation" type="button" onClick={() => { adminLdapSecurityContainer.changeLdapBindMode('manager') }}>
                        <a role="menuitem">{ t('security_setting.ldap.bind_manager') }</a>
                      </li>
                      <li key="user" role="presentation" type="button" onClick={() => { adminLdapSecurityContainer.changeLdapBindMode('user') }}>
                        <a role="menuitem">{ t('security_setting.ldap.bind_user') }</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <strong className="col-xs-3 text-right">Bind DN</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="bindDN"
                  value={adminLdapSecurityContainer.state.bindDN}
                  onChange={e => adminLdapSecurityContainer.changeBindDN(e.target.value)}
                />
                {(adminLdapSecurityContainer.state.bindMode === 'manager') ? (
                  <p className="help-block passport-ldap-managerbind">
                    <small>
                      { t('security_setting.ldap.bind_DN_manager_detail') }<br />
                      { t('security_setting.example') }1: <code>uid=admin,dc=domain,dc=com</code><br />
                      { t('security_setting.example') }2: <code>admin@domain.com</code>
                    </small>
                  </p>
                ) : (
                  <p className="help-block passport-ldap-userbind">
                    <small>
                      { t('security_setting.ldap.bind_DN_user_detail1')}<br />
                      {/* eslint-disable-next-line react/no-danger */}
                      <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.bind_DN_user_detail2') }} /><br />
                      { t('security_setting.example') }1: <code>uid={'{{ username }}'},dc=domain,dc=com</code><br />
                      { t('security_setting.example') }2: <code>{'{{ username }}'}@domain.com</code>
                    </small>
                  </p>
                )}
              </div>
            </div>

            <div className="row mb-5">
              <label htmlFor="bindDNPassword" className="col-xs-3 text-right">{ t('security_setting.ldap.bind_DN_password') }</label>
              <div className="col-xs-6">
                <input
                  className="form-control passport-ldap-managerbind"
                  type="password"
                  name="bindDNPassword"
                  value={adminLdapSecurityContainer.state.bindDNPassword}
                  onChange={e => adminLdapSecurityContainer.changeBindDNPassword(e.target.value)}
                />
                {(adminLdapSecurityContainer.state.bindMode === 'manager') ? (
                  <p className="help-block passport-ldap-managerbind">
                    <small>
                      { t('security_setting.ldap.bind_DN_password_manager_detail') }
                    </small>
                  </p>
                ) : (
                  <p className="help-block passport-ldap-userbind">
                    <small>
                      { t('security_setting.ldap.bind_DN_password_user_detail') }
                    </small>
                  </p>
                )}
              </div>
            </div>

            <div className="row mb-5">
              <strong className="col-xs-3 text-right">{ t('security_setting.ldap.search_filter') }</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="searchFilter"
                  value={adminLdapSecurityContainer.state.searchFilter}
                  onChange={e => adminLdapSecurityContainer.changeSearchFilter(e.target.value)}
                />
                <p className="help-block">
                  <small>
                    { t('security_setting.ldap.search_filter_detail1') }<br />
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.search_filter_detail2') }} /><br />
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.search_filter_detail3') }} />
                  </small>
                </p>
                <p className="help-block">
                  <small>
                    { t('security_setting.example') }1 - { t('security_setting.ldap.search_filter_example1') }:
                    <code>(|(uid={'{{ username }}'})(mail={'{{ username }}'}))</code><br />
                    { t('security_setting.example') }2 - { t('security_setting.ldap.search_filter_example2') }:
                    <code>(sAMAccountName={'{{ username }}'})</code>
                  </small>
                </p>
              </div>
            </div>

            <h3 className="alert-anchor border-bottom">
              Attribute Mapping ({ t('security_setting.optional') })
            </h3>

            <div className="row mb-5">
              <strong htmlFor="attrMapUsername" className="col-xs-3 text-right">{t('username')}</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default: uid"
                  name="attrMapUsername"
                  value={adminLdapSecurityContainer.state.attrMapUsername}
                  onChange={e => adminLdapSecurityContainer.changeAttrMapUsername(e.target.value)}
                />
                <p className="help-block">
                  {/* eslint-disable-next-line react/no-danger */}
                  <small dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.username_detail') }} />
                </p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-xs-offset-3 col-xs-6 text-left">
                <div className="checkbox checkbox-success">
                  <input
                    id="cbSameUsernameTreatedAsIdenticalUser"
                    type="checkbox"
                    checked={adminLdapSecurityContainer.state.cbSameUsernameTreatedAsIdenticalUser}
                    onChange={() => { adminLdapSecurityContainer.switchCbSameUsernameTreatedAsIdenticalUser() }}
                  />
                  <label
                    htmlFor="cbSameUsernameTreatedAsIdenticalUser"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: t('security_setting.Treat username matching as identical') }}
                  />
                </div>
                <p className="help-block">
                  {/* eslint-disable-next-line react/no-danger */}
                  <small dangerouslySetInnerHTML={{ __html: t('security_setting.Treat username matching as identical_warn') }} />
                </p>
              </div>
            </div>

            <div className="row mb-5">
              <strong htmlFor="attrMapMail" className="col-xs-3 text-right">{ t('Email') }</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default: mail"
                  name="attrMapMail"
                  value={adminLdapSecurityContainer.state.attrMapMail}
                  onChange={e => adminLdapSecurityContainer.changeAttrMapMail(e.target.value)}
                />
                <p className="help-block">
                  <small>
                    { t('security_setting.ldap.mail_detail') }
                  </small>
                </p>
              </div>
            </div>

            <div className="row mb-5">
              <strong htmlFor="attrMapName" className="col-xs-3 text-right">{ t('Name') }</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="attrMapName"
                  value={adminLdapSecurityContainer.state.attrMapName}
                  onChange={e => adminLdapSecurityContainer.changeAttrMapName(e.target.value)}
                />
                <p className="help-block">
                  <small>
                    { t('security_setting.ldap.name_detail') }
                  </small>
                </p>
              </div>
            </div>


            <h3 className="alert-anchor border-bottom">
              { t('security_setting.ldap.group_search_filter') } ({ t('security_setting.optional') })
            </h3>

            <div className="row mb-5">
              <strong htmlFor="groupSearchBase" className="col-xs-3 text-right">{ t('security_setting.ldap.group_search_base_DN') }</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="groupSearchBase"
                  value={adminLdapSecurityContainer.state.groupSearchBase}
                  onChange={e => adminLdapSecurityContainer.changeGroupSearchBase(e.target.value)}
                />
                <p className="help-block">
                  <small>
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_base_DN_detail') }} /><br />
                    { t('security_setting.example') }: <code>ou=groups,dc=domain,dc=com</code>
                  </small>
                </p>
              </div>
            </div>

            <div className="row mb-5">
              <strong htmlFor="groupSearchFilter" className="col-xs-3 text-right">{ t('security_setting.ldap.group_search_filter') }</strong>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="groupSearchFilter"
                  value={adminLdapSecurityContainer.state.groupSearchFilter}
                  onChange={e => adminLdapSecurityContainer.changeGroupSearchFilter(e.target.value)}
                />
                <p className="help-block">
                  <small>
                    {/* eslint-disable react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_filter_detail1') }} /><br />
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_filter_detail2') }} /><br />
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_filter_detail3') }} />
                    {/* eslint-enable react/no-danger */}
                  </small>
                </p>
                <p className="help-block">
                  <small>
                    { t('security_setting.example') }:
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_filter_detail4') }} />
                  </small>
                </p>
              </div>
            </div>

            <div className="row mb-5">
              <label htmlFor="groupDnProperty" className="col-xs-3 text-right">{ t('security_setting.ldap.group_search_user_DN_property') }</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Default: uid"
                  name="groupDnProperty"
                  value={adminLdapSecurityContainer.state.groupDnProperty}
                  onChange={e => adminLdapSecurityContainer.changeGroupDnProperty(e.target.value)}
                />
                <p className="help-block">
                  {/* eslint-disable-next-line react/no-danger */}
                  <small dangerouslySetInnerHTML={{ __html: t('security_setting.ldap.group_search_user_DN_property_detail') }} />
                </p>
              </div>
            </div>

          </React.Fragment>
        )}

      </React.Fragment>
    );
  }

}

SecurityLdapSetting.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminGeneralSecurityContainer: PropTypes.instanceOf(AdminGeneralSecurityContainer).isRequired,
  adminLdapSecurityContainer: PropTypes.instanceOf(AdminLdapSecurityContainer).isRequired,
};

const SecurityLdapSettingWrapper = (props) => {
  return createSubscribedElement(SecurityLdapSetting, props, [AppContainer, AdminGeneralSecurityContainer, AdminLdapSecurityContainer]);
};

export default withTranslation()(SecurityLdapSettingWrapper);
