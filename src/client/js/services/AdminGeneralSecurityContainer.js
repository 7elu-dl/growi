import { Container } from 'unstated';

import loggerFactory from '@alias/logger';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:security:AdminGeneralSecurityContainer');

/**
 * Service container for admin security page (SecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminGeneralSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      // TODO GW-583 set value
      isWikiModeForced: false,
      currentRestrictGuestMode: 'deny',
      currentpageCompleteDeletionAuthority: 'anyone',
      isHideRestrictedByOwner: true,
      isHideRestrictedByGroup: true,
      useOnlyEnvVarsForSomeOptions: true,
      appSiteUrl: '',
      isLocalEnabled: true,
      registrationMode: 'open',
      registrationWhiteList: '',
      isLdapEnabled: true,
      isSamlEnabled: true,
      isOidcEnabled: true,
    };

    this.init();

    this.switchIsLocalEnabled = this.switchIsLocalEnabled.bind(this);
    this.changeRegistrationMode = this.changeRegistrationMode.bind(this);
    this.changeRestrictGuestMode = this.changeRestrictGuestMode.bind(this);
    this.switchIsHideRestrictedByGroup = this.switchIsHideRestrictedByGroup.bind(this);
    this.switchIsHideRestrictedByOwner = this.switchIsHideRestrictedByOwner.bind(this);
    this.changePageCompleteDeletionAuthority = this.changePageCompleteDeletionAuthority.bind(this);
  }

  init() {
    // TODO GW-583 fetch config value with api
  }


  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminGeneralSecurityContainer';
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

  /**
   * Switch LDAP enabled
   */
  switchIsLdapEnabled() {
    this.setState({ isLdapEnabled: !this.state.isLdapEnabled });
  }

  /**
   * Switch SAML enabled
   */
  switchIsSamlEnabled() {
    this.setState({ isSamlEnabled: !this.state.isSamlEnabled });
  }

  /**
   * Switch Oidc enabled
   */
  switchIsOidcEnabled() {
    this.setState({ isOidcEnabled: !this.state.isOidcEnabled });
  }
   * Change restrictGuestMode
   */
  changeRestrictGuestMode(restrictGuestModeLabel) {
    this.setState({ currentRestrictGuestMode: restrictGuestModeLabel });
  }

  /**
   * Change pageCompleteDeletionAuthority
   */
  changePageCompleteDeletionAuthority(pageCompleteDeletionAuthorityLabel) {
    this.setState({ currentpageCompleteDeletionAuthority: pageCompleteDeletionAuthorityLabel });
  }

  /**
   * Switch hideRestrictedByOwner
   */
  switchIsHideRestrictedByOwner() {
    this.setState({ isHideRestrictedByOwner:  !this.state.isHideRestrictedByOwner });
  }

  /**
   * Switch hideRestrictedByGroup
   */
  switchIsHideRestrictedByGroup() {
    this.setState({ isHideRestrictedByGroup:  !this.state.isHideRestrictedByGroup });
  }

  /**
   * Update restrictGuestMode
   * @memberOf AdminSecuritySettingContainer
   * @return {string} Appearance
   */
  async updateRestrictGuestMode() {
    const response = await this.appContainer.apiv3.put('/security-setting/guest-mode', {
      restrictGuestMode: this.state.currentRestrictGuestMode,
    });
    const { securitySettingParams } = response.data;
    return securitySettingParams;
  }

  /**
   * Update pageDeletion
   * @memberOf AdminSecuritySettingContainer
   * @return {string} pageDeletion
   */
  async updatePageCompleteDeletionAuthority() {
    const response = await this.appContainer.apiv3.put('/security-setting/page-deletion', {
      pageCompleteDeletionAuthority: this.state.currentPageCompleteDeletionAuthority,
    });
    const { securitySettingParams } = response.data;
    return securitySettingParams;
  }

  /**
   * Update function
   * @memberOf AdminSecucitySettingContainer
   * @return {string} Functions
   */
  async updateSecurityFunction() {
    const response = await this.appContainer.apiv3.put('/security-setting/function', {
      hideRestrictedByGroup: this.state.hideRestrictedByGroup,
      hideRestrictedByOwner: this.state.hideRestrictedByOwner,
    });
    const { securitySettingParams } = response.data;
    return securitySettingParams;
  }


}
