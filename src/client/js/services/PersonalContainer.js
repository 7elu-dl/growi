import { Container } from 'unstated';

import loggerFactory from '@alias/logger';

import { toastError } from '../util/apiNotification';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:services:PersonalContainer');

/**
 * Service container for personal settings page (PersonalSettings.jsx)
 * @extends {Container} unstated Container
 */
export default class PersonalContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      name: '',
      email: '',
      registrationWhiteList: [],
      isEmailPublished: false,
      lang: 'English',
      externalAccounts: [],
    };

  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'PersonalContainer';
  }

  /**
   * retrieve personal data
   */
  async retrievePersonalData() {
    try {
      // TODO GW-1036 retrieve data
    }
    catch (err) {
      logger.error(err);
      toastError(new Error('Failed to fetch data'));
    }
  }

  /**
   * Change name
   */
  changeName(inputValue) {
    this.setState({ name: inputValue });
  }

  /**
   * Change email
   */
  changeEmail(inputValue) {
    this.setState({ email: inputValue });
  }

  /**
   * Change isEmailPublished
   */
  changeIsEmailPublished(boolean) {
    this.setState({ isEmailPublished: boolean });
  }

  /**
   * Change lang
   */
  changeLang(lang) {
    this.setState({ lang });
  }

  /**
   * Update basic info
   * @memberOf PersonalContainer
   * @return {Array} basic info
   */
  async updateBasicInfo() {
    // TODO GW-1036 create apiV3
  }

}
