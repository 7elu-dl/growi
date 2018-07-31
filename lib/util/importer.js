/**
 * importer
 */
module.exports = crowi => {
  'use strict';

  const logger = require('@alias/logger')('growi:util:importer');
  const esa = require('esa-nodejs');
  const config = crowi.getConfig();
  const createGrowiPages = require('./createGrowiPagesFromImports')(crowi);
  const restQiitaAPI = require('./restQiitaAPI');
  let qiitaClient;
  let importer = {};
  let esaClient = {};

  /**
   * Initialize importer
   */
  importer.initialize = () => {
    esaClient = esa({
      team:        config.crowi['importer:esa:team_name'],
      accessToken: config.crowi['importer:esa:access_token'],
    });
    logger.info('initialize esa importer');
    qiitaClient = restQiitaAPI(
      config.crowi['importer:qiita:team_name'],
      config.crowi['importer:qiita:access_token']
    );
    logger.info('initialize qiita importer');
  };

  /**
   * Import page data from esa to GROWI
   */
  importer.importDataFromEsa = user => {
    return new Promise((resolve, reject) => {
      const firstPage = 1;
      const errors = importPostsFromEsa(firstPage, user, []);

      resolve(errors);
    });
  };

  const importPostsFromEsa = (pageNum, user, errors) => {
    return new Promise((resolve, reject) => {
      esaClient.api.posts({page: pageNum, per_page: 100}, async(err, res) => {
        const nextPage = res.body.next_page;
        const postsReceived = res.body.posts;

        if (err) {
          reject(`error in page ${pageNum}: ${err}`);
        }

        const data = convertEsaDataForGrowi(postsReceived, user);
        const newErrors = await createGrowiPages(data);

        if (nextPage) {
          return resolve(importPostsFromEsa(nextPage, user, errors.concat(newErrors)));
        }

        resolve(errors.concat(newErrors));
      });
    });
  };

  /**
   * Import page data from qiita to GROWI
   */
  importer.importDataFromQiita = user => {
    return new Promise((resolve, reject) => {
      const firstPage = 1;
      const errors = importPostsFromQiita(firstPage, user, []);

      resolve(errors);
    });
  };

  const importPostsFromQiita = (pageNum, user, errors) => {
    return new Promise((resolve, reject) => {
      qiitaClient.getQiitaPages(pageNum)
      .then(function(res) {
        const next = pageNum * 100 + 1;
        const postsReceived = res[0];
        const pageTotal = res[1];
        const data = convertQiitaDataForGrowi(postsReceived, user);

        createGrowiPages(data)
        .then(function(newErrors) {
          if (next <= pageTotal) {
            return resolve(importPostsFromQiita(next, user, errors.concat(newErrors)));
          }

          resolve(errors.concat(newErrors));
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  /**
   * Convert data into usable format for createGrowiPagesFromImports
   */
  const convertEsaDataForGrowi = (pages, user) => {
    const basePage = '';
    const data = pages.map(post => {
      const category = post.category;
      const name = post.name;

      let path = '';

      if (category && name) {
        path = `${category}/${name}`;
      }
      else if (category) {
        path = category;
      }
      else if (name) {
        path = name;
      }

      return {
        path: `${basePage}/${path}`,
        body: post.body_md,
        user: user,
      };
    });

    return data;
  };

    /**
   * Convert data into usable format for createGrowiPagesFromImports
   */
  const convertQiitaDataForGrowi = (pages, user) => {
    const basePage = '';
    const data = pages.map(post => {
      const title = post.title;
      let path = title;

      return {
        path: `${basePage}/${path}`,
        body: post.body,
        user: user,
      };
    });

    return data;
  };

  /**
   * Import page data from esa to GROWI
   */
  importer.testConnectionToEsa = () => {
    return new Promise(async(resolve, reject) => {
      try {
        await getTeamNameFromEsa();
        resolve();
      }
      catch (err) {
        reject(err);
      }
    });
  };

    /**
   * Import page data from qiita to GROWI
   */
  importer.testConnectionToQiita = () => {
    return new Promise(async(resolve, reject) => {
      try {
        await qiitaClient.getQiitaUser();
        resolve();
      }
      catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Get teams from esa (Promise wrapper)
   */
  const getTeamNameFromEsa = () => {
    return new Promise((resolve, reject) => {
      esaClient.api.team((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  };

  // initialize when server starts
  importer.initialize();

  return importer;
};
