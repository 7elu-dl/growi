import { pathUtils } from 'growi-commons';

import PagePath from './PagePath';

/**
 * Linked Array Structured PagePath Model
 */
export default class LinkedPagePath {

  constructor(path, skipNormalize = false) {

    const pagePath = new PagePath(path, false, skipNormalize);

    this.pathName = pagePath.latter;
    this.parent = pagePath.former != null
      ? new LinkedPagePath(pagePath.former, true)
      : null;

  }

  get href() {
    if (this.parent == null) {
      return '/';
    }

    return pathUtils.normalizePath(`${this.parent.href}/${this.pathName}`);
  }

}
