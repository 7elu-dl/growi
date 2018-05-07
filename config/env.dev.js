module.exports = {
  NODE_ENV: 'development',
  FILE_UPLOAD: 'local',
  // MATHJAX: 1,
  // ELASTICSEARCH_URI: 'http://localhost:9200/growi',
  PLUGIN_NAMES_TOBE_LOADED: [
    // 'growi-plugin-lsx',
    // 'growi-plugin-pukiwiki-like-linker',
  ],
  // filters for debug
  DEBUG: [
    // 'express:*',
    // 'crowi:*',
    'crowi:crowi',
    // 'crowi:crowi:dev',
    'crowi:crowi:express-init',
    'crowi:models:external-account',
    // 'crowi:routes:login',
    'crowi:routes:login-passport',
    'crowi:service:PassportService',
    // 'crowi:routes:page',
    // 'crowi:plugins:*',
    // 'crowi:InterceptorManager',
  ].join(),
}
