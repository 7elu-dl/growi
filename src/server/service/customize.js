const logger = require('@alias/logger')('growi:service:CustomizeService'); // eslint-disable-line no-unused-vars

/**
 * the service class of CustomizeService
 */
class CustomizeService {

  constructor(crowi) {
    this.crowi = crowi;
    this.configManager = crowi.configManager;
    this.appService = crowi.appService;
    this.xssService = crowi.xssService;

    this.sidebarContentCache = null;
    this.remarkRenderer = null;

    this.initRemark();
  }

  initRemark() {
    const remark = require('remark');
    const html = require('remark-html');

    this.remarkRenderer = remark()
      .use(html, { sanitize: false });
  }

  /**
   * initialize custom css strings
   */
  initCustomCss() {
    const uglifycss = require('uglifycss');

    const rawCss = this.configManager.getConfig('crowi', 'customize:css') || '';

    // uglify and store
    this.customCss = uglifycss.processString(rawCss);
  }

  getCustomCss() {
    return this.customCss;
  }

  getCustomScript() {
    return this.configManager.getConfig('crowi', 'customize:script') || '';
  }

  initCustomTitle() {
    let configValue = this.configManager.getConfig('crowi', 'customize:title');

    if (configValue == null || configValue.trim().length === 0) {
      configValue = '{{page}} - {{sitename}}';
    }

    this.customTitleTemplate = configValue;
  }

  async initSidebar() {
    const Revision = this.crowi.model('Revision');

    const revision = await Revision.findLatestRevision('/Sidebar');

    if (revision != null) {
      this.sidebarContentCache = this.remarkRenderer.processSync(revision.body).toString();
      // TODO: render sidebar
    }
  }

  generateCustomTitle(page) {
    // replace
    const customTitle = this.customTitleTemplate
      .replace('{{sitename}}', this.appService.getAppTitle())
      .replace('{{page}}', page);

    return this.xssService.process(customTitle);
  }


}

module.exports = CustomizeService;
