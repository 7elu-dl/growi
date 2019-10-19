import { Container } from 'unstated';

/**
 * Service container for admin markdown setting page (MarkDownSetting.jsx)
 * @extends {Container} unstated Container
 */
export default class MarkDownSettingContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      pageBreakSeparator: appContainer.config.pageBreakSeparator,
      pageBreakCustomSeparator: appContainer.config.pageBreakCustomSeparator || '',
      isEnabledXss: (appContainer.config.xssOption != null),
      xssOption: appContainer.config.xssOption,
      tagWhiteList: appContainer.config.tagWhiteList || '',
      attrWhiteList: appContainer.config.attrWhiteList || '',
    };

    this.switchEnableXss = this.switchEnableXss.bind(this);
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'MarkDownSettingContainer';
  }

  /**
   * Switch enableXss
   */
  switchEnableXss() {
    if (this.state.isEnabledXss) {
      this.setState({ xssOption: null });
    }
    this.setState({ isEnabledXss: !this.state.isEnabledXss });
  }

  /**
   * Update Xss Setting
   */
  async updateXssSetting() {

    const response = await this.appContainer.apiv3.put('/markdown-setting/xss', {
      isEnabledXss: this.state.isEnabledXss,
      xssOption: this.state.xssOption,
      tagWhiteList: this.state.tagWhiteList,
      attrWhiteList: this.state.attrWhiteList,
    });

    return response;
  }

  /**
   * Update Presentation Setting
   */
  async updatePresentationSetting() {

    const response = await this.appContainer.apiv3.put('/markdown-setting/presentation', {
      pageBreakSeparator: this.state.pageBreakSeparator,
      pageBreakCustomSeparator: this.state.pageBreakCustomSeparator,
    });

    return response;
  }

}
