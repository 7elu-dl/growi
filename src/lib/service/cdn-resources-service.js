const urljoin = require('url-join');

const helpers = require('@commons/util/helpers');

const CdnResourcesDownloader = require('./cdn-resources-downloader');
const CdnResource = CdnResourcesDownloader.CdnResource;

const cdnLocalScriptRoot = 'public/js/cdn';
const cdnLocalScriptWebRoot = '/js/cdn';
const cdnLocalStyleRoot = 'public/styles/cdn';
const cdnLocalStyleWebRoot = '/styles/cdn';


class CdnResourcesService {
  constructor() {
    this.logger = require('@alias/logger')('growi:service:CdnResourcesService');

    this.noCdn = !!process.env.NO_CDN;
    this.loadManifests();
  }

  loadManifests() {
    this.cdnManifests = require('@root/resource/cdn-manifests');
    this.logger.debug('manifest data loaded : ', this.cdnManifests);
  }

  async downloadAndWriteAll() {
    const downloader = new CdnResourcesDownloader();

    const cdnScriptResources = this.cdnManifests.js.map(manifest => {
      const outDir = helpers.root(cdnLocalScriptRoot);
      return new CdnResource(manifest.name, manifest.url, outDir);
    });
    const cdnStyleResources = this.cdnManifests.style.map(manifest => {
      const outDir = helpers.root(cdnLocalStyleRoot);
      return new CdnResource(manifest.name, manifest.url, outDir);
    });

    const dlStylesOptions = {
      replaceUrl: {
        webroot: cdnLocalStyleWebRoot,
      }
    };

    return Promise.all([
      downloader.downloadScripts(cdnScriptResources),
      downloader.downloadStyles(cdnStyleResources, dlStylesOptions),
    ]);
  }

  /**
   * Generate script tag string
   *
   * @param {Object} manifest
   * @param {boolean} noCdn
   */
  generateScriptTag(manifest, noCdn) {
    const attrs = [];
    const args = manifest.args || {};

    if (args.async) {
      attrs.push('async');
    }
    if (args.defer) {
      attrs.push('defer');
    }

    // TODO process integrity

    const url = noCdn
      ? urljoin(cdnLocalScriptWebRoot, manifest.name) + '.js'
      : manifest.url;
    return `<script src="${url}" ${attrs.join(' ')}></script>`;
  }

  getScriptTagByName(name) {
    const tags = this.cdnManifests.js
      .filter(manifest => manifest.name === name)
      .map(manifest => {
        return this.generateScriptTag(manifest, this.noCdn);
      });
    return tags[0];
  }

  getScriptTagsByGroup(group) {
    return this.cdnManifests.js
      .filter(manifest => {
        return manifest.groups != null && manifest.groups.includes(group);
      })
      .map(manifest => {
        return this.generateScriptTag(manifest, this.noCdn);
      });
  }

  /**
   * Generate style tag string
   *
   * @param {Object} manifest
   * @param {boolean} noCdn
   */
  generateStyleTag(manifest, noCdn) {
    const attrs = [];
    const args = manifest.args || {};

    if (args.async) {
      attrs.push('async');
    }
    if (args.defer) {
      attrs.push('defer');
    }

    // TODO process integrity

    const url = noCdn
      ? urljoin(cdnLocalStyleWebRoot, manifest.name) + '.css'
      : manifest.url;

    return `<link rel="stylesheet" href="${url}" ${attrs.join(' ')}>`;
  }

  getStyleTagByName(name) {
    const tags = this.cdnManifests.style
      .filter(manifest => manifest.name === name)
      .map(manifest => {
        return this.generateStyleTag(manifest, this.noCdn);
      });
    return tags[0];
  }

  getStyleTagsByGroup(group) {
    return this.cdnManifests.style
      .filter(manifest => {
        return manifest.groups != null && manifest.groups.includes(group);
      })
      .map(manifest => {
        return this.generateStyleTag(manifest, this.noCdn);
      });
  }
}

module.exports = CdnResourcesService;
