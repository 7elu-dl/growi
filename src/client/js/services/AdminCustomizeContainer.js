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
      currentBehavior: appContainer.config.behaviorType,
      isEnabledTimeline: appContainer.config.isEnabledTimeline,
      isSavedStatesOfTabChanges: appContainer.config.isSavedStatesOfTabChanges,
      isEnabledAttachTitleHeader: appContainer.config.isEnabledAttachTitleHeader,
      currentRecentCreatedLimit: appContainer.config.recentCreatedLimit,
      currentHighlightJsStyle: appContainer.config.highlightJsStyle,
      isHighlightJsStyleBorderEnabled: appContainer.config.highlightJsStyleBorder,
      currentCustomizeHeader: appContainer.config.customizeHeader,
      currentCustomizeCss: appContainer.config.customizeCss,
      currentCustomizeScript: appContainer.config.customizeScript,
    };

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
   * Switch behaviorType
   */
  switchBehaviorType(behaviorName) {
    this.setState({ currentBehavior: behaviorName });
  }

  /**
   * Switch enabledTimeLine
   */
  switchEnableTimeline() {
    this.setState({ isEnabledTimeline:  !this.state.isEnabledTimeline });
  }

  /**
   * Switch savedStatesOfTabChanges
   */
  switchSavedStatesOfTabChanges() {
    this.setState({ isSavedStatesOfTabChanges:  !this.state.isSavedStatesOfTabChanges });
  }

  /**
   * Switch enabledAttachTitleHeader
   */
  switchEnabledAttachTitleHeader() {
    this.setState({ isEnabledAttachTitleHeader:  !this.state.isEnabledAttachTitleHeader });
  }

  /**
   * Switch recentCreatedLimit
   */
  switchRecentCreatedLimit(value) {
    this.setState({ currentRecentCreatedLimit: value });
  }

  /**
   * Switch highlightJsStyle
   */
  switchHighlightJsStyle(value) {
    this.setState({ currentHighlightJsStyle: value });
  }

  /**
   * Switch highlightJsStyleBorder
   */
  switchHighlightJsStyleBorder() {
    this.setState({ isHighlightJsStyleBorderEnabled: !this.state.isHighlightJsStyleBorderEnabled });
  }

  /**
   * Change customize Html header
   */
  changeCustomizeHeader(inputValue) {
    this.setState({ currentCustomizeHeader: inputValue });
  }

  /**
   * Change customize css
   */
  changeCustomizeCss(inputValue) {
    this.setState({ currentCustomizeCss: inputValue });
  }

  /**
   * Change customize script
   */
  changeCustomizeScript(inpuValue) {
    this.setState({ currentCustomizeScript: inpuValue });
  }


  /**
   * Update layout
   * @memberOf AdminCustomizeContainer
   * @return {Array} Appearance
   */
  async updateCustomizeLayoutAndTheme() {
    const response = await this.appContainer.apiv3.put('/customize-setting/layoutTheme', {
      layoutType: this.state.currentLayout,
      themeType: this.state.currentTheme,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update behavior
   * @memberOf AdminCustomizeContainer
   * @return {string} Behavior
   */
  async updateCustomizeBehavior() {
    const response = await this.appContainer.apiv3.put('/customize-setting/behavior', {
      behaviorType: this.state.currentBehavior,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update function
   * @memberOf AdminCustomizeContainer
   * @return {string} Functions
   */
  async updateCustomizeFunction() {
    const response = await this.appContainer.apiv3.put('/customize-setting/function', {
      isEnabledTimeline: this.state.isEnabledTimeline,
      isSavedStatesOfTabChanges: this.state.isSavedStatesOfTabChanges,
      isEnabledAttachTitleHeader: this.state.isEnabledAttachTitleHeader,
      recentCreatedLimit: this.state.currentRecentCreatedLimit,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update code highlight
   * @memberOf AdminCustomizeContainer
   * @return {Array} Code highlight
   */
  async updateHighlightJsStyle() {
    // TODO GW-515 create apiV3
  }


  /**
   * Update customCss
   * @memberOf AdminCustomizeContainer
   * @return {string} Customize css
   */
  async updateCustomizeCss() {
    const response = await this.appContainer.apiv3.put('/customize-setting/customizeCss', {
      customizeCss: this.state.currentCustomizeCss,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update customize script
   * @memberOf AdminCustomizeContainer
   * @return {string} Customize scripts
   */
  async updateCustomizeScript() {
    const response = await this.appContainer.apiv3.put('/customize-setting/customizeScript', {
      customizeScript: this.state.currentCustomizeScript,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }


}
