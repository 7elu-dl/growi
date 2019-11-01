import { Container } from 'unstated';

/**
 * Service container for admin customize setting page (Customize.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminCustomizeContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      currentTheme: appContainer.config.themeType,
      currentLayout: appContainer.config.layoutType,
    };

    this.switchLayoutType = this.switchLayoutType.bind(this);
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminCustomizeContainer';
  }

  /**
   * Switch layoutType
   */
  switchLayoutType(lauoutName) {
    this.setState({ currentLayout: lauoutName });
  }

  /**
   * Switch themeType
   */
  switchThemeType(themeName) {
    // can't choose theme when kibela
    if (this.state.currentLayout === 'kibela') {
      return;
    }
    this.setState({ currentTheme: themeName });
  }

  /**
   * Update layout
   * @memberOf AdminCustomizeContainer
   * @return {Array}} Appearance
   */
  async updateCustomizeLayoutAndTheme() {
    await this.appContainer.apiv3.put('/customize-setting/layoutTheme');
    // const { username } = response.data.userData;
    const Appearance = [];
    return Appearance;
  }

}
