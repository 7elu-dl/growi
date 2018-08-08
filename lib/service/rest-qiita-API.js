const debug = require('debug')('growi:service:GlobalNotification');

function getAxios(team, token) {
  return require('axios').create({
    baseURL: `https://${team}.qiita.com/api/v2`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'authorization': `Bearer ${token}`
    },
    responseType: 'json'
  });
};

/**
 * the service class of restQiitaAPI
 * Qiita API v2 documant https://qiita.com/api/v2/docs
 */

class RestQiitaAPIService {

  constructor(crowi) {
    this.crowi = crowi;
    this.config = crowi.getConfig();
    this.team = this.config.crowi['importer:qiita:team_name'];
    this.token = this.config.crowi['importer:qiita:access_token'];
    this.axios = getAxios(this.team, this.token);
  };

  /**
   * get Qiita API
   * @memberof RestQiitaAPI
   * @param {string} path
   */
  async restAPI(path) {
    return this.axios.get(path)
      .then(function(res) {
        const data = res.data;
        const total = res.headers['total-count'];
        return {data, total};
      })
      .catch(function(err) {
        return err;
      });
  };

  /**
   * get Qiita user
   * @memberof RestQiitaAPI
   */
  async getQiitaUser() {
    try {
      const res = await this.restAPI('/users');
      const user = res.data;
      if(user.length > 0) {
        return user;
      }
    } catch (err) {
      throw err;
    }
  };


  /**
   * get Qiita pages
   * @memberof RestQiitaAPI
   * @param {string} pageNum
   * @param {string} per_page
   */
  async getQiitaPages(pageNum, per_page) {
    try {
      const res = await this.restAPI(`/items?page=${pageNum}&per_page=${per_page}`);
      const pages = res.data;
      const total = res.total;
      if(pages.length > 0) {
        return {pages, total};
      }
    } catch (err) {
      throw err;
    }
  };
}

module.exports = RestQiitaAPIService;
