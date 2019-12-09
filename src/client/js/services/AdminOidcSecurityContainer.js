import { Container } from 'unstated';

import loggerFactory from '@alias/logger';
import { pathUtils } from 'growi-commons';

import urljoin from 'url-join';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:security:AdminOidcSecurityContainer');

/**
 * Service container for admin security page (OidcSecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminOidcSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      callbackUrl: urljoin(pathUtils.removeTrailingSlash(appContainer.config.crowi.url), '/passport/oidc/callback'),
      oidcProviderName: '',
      oidcIssuerHost: '',
      oidcClientId: '',
      oidcClientSecret: '',
      oidcAttrMapId: '',
      oidcAttrMapUserName: '',
      oidcAttrMapName: '',
      oidcAttrMapEmail: '',
      isSameUsernameTreatedAsIdenticalUser: true,
      isSameEmailTreatedAsIdenticalUser: true,
    };

    this.init();

  }

  init() {
    // TODO GW-583 fetch config value with api
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminOidcSecurityContainer';
  }

  /**
   * Change oidcProviderName
   */
  changeOidcProviderName(inputValue) {
    this.setState({ oidcProviderName: inputValue });
  }

  /**
   * Change oidcIssuerHost
   */
  changeOidcIssuerHost(inputValue) {
    this.setState({ oidcIssuerHost: inputValue });
  }

  /**
   * Change oidcClientId
   */
  changeOidcClientId(inputValue) {
    this.setState({ oidcClientId: inputValue });
  }

  /**
   * Change oidcClientSecret
   */
  changeOidcClientSecret(inputValue) {
    this.setState({ oidcClientSecret: inputValue });
  }

  /**
   * Change oidcAttrMapId
   */
  changeOidcAttrMapId(inputValue) {
    this.setState({ oidcAttrMapId: inputValue });
  }

  /**
   * Change oidcAttrMapUserName
   */
  changeOidcAttrMapUserName(inputValue) {
    this.setState({ oidcAttrMapUserName: inputValue });
  }

  /**
   * Change oidcAttrMapName
   */
  changeOidcAttrMapName(inputValue) {
    this.setState({ oidcAttrMapName: inputValue });
  }

  /**
   * Change oidcAttrMapEmail
   */
  changeOidcAttrMapEmail(inputValue) {
    this.setState({ oidcAttrMapEmail: inputValue });
  }

  /**
   * Switch sameUsernameTreatedAsIdenticalUser
   */
  switchIsSameUsernameTreatedAsIdenticalUser() {
    this.setState({ isSameUsernameTreatedAsIdenticalUser: !this.state.isSameUsernameTreatedAsIdenticalUser });
  }

  /**
   * Switch sameEmailTreatedAsIdenticalUser
   */
  switchIsSameEmailTreatedAsIdenticalUser() {
    this.setState({ isSameEmailTreatedAsIdenticalUser: !this.state.isSameEmailTreatedAsIdenticalUser });
  }

}
