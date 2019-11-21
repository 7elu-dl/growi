import { Container } from 'unstated';

import loggerFactory from '@alias/logger';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:services:AdminSecurityContainer');

/**
 * Service container for admin security page (SecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      // TODO GW-583 set value
      useOnlyEnvVarsForSomeOptions: true,
      isLocalEnabled: true,
      registrationMode: 'open',
      registrationWhiteList: '',
      ldapConfig: {
        isEnabled: true,
        serverUrl: '',
        bindMode: 'manager',
        bindDN: '',
      },
    };

    this.init();

    this.switchIsLocalEnabled = this.switchIsLocalEnabled.bind(this);
    this.changeRegistrationMode = this.changeRegistrationMode.bind(this);
    this.switchIsLdapEnabled = this.switchIsLdapEnabled.bind(this);
    this.changeLdapBindMode = this.changeLdapBindMode.bind(this);
  }

  init() {
    // TODO GW-583 fetch config value with api
  }


  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminSecurityContainer';
  }

  /**
   * Switch local enabled
   */
  switchIsLocalEnabled() {
    this.setState({ isLocalEnabled: !this.state.isLocalEnabled });
  }

  /**
   * Change registration mode
   */
  changeRegistrationMode(value) {
    this.setState({ registrationMode: value });
  }

  // LDAP function

  /**
   * Switch local enabled
   */
  switchIsLdapEnabled() {
    const newLdapConfig = this.state.ldapConfig;
    newLdapConfig.isEnabled = !this.state.ldapConfig.isEnabled;
    this.setState({ newLdapConfig });
  }

  /**
   * Change server url
   */
  changeServerUrl(inputValue) {
    const newLdapConfig = this.state.ldapConfig;
    newLdapConfig.serverUrl = inputValue;
    this.setState({ newLdapConfig });
  }

  /**
   * Change ldap bind mode
   */
  changeLdapBindMode(mode) {
    const newLdapConfig = this.state.ldapConfig;
    newLdapConfig.bindMode = mode;
    this.setState({ newLdapConfig });
  }

  /**
   * Change bind DN
   */
  changeBindDN(inputValue) {
    const newLdapConfig = this.state.ldapConfig;
    newLdapConfig.bindDN = inputValue;
    this.setState({ newLdapConfig });
  }

}
