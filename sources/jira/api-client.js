const util = require('util');

const debuglog = util.debuglog('api-client');
const fetch = require('node-fetch');

function options(credentials) {
  return {
    'content-type': 'application/json',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.token}`).toString('base64')}`,
      Acccept: 'application/json',
    },
    method: 'GET',
  };
}

function get({ credentials, url, optionsOverride = {} }, callback) {
  return fetch(url, { ...options(credentials), ...optionsOverride })
    .then((response) => {
      debuglog(`get: ${response.status} ${response.statusText}`);
      // console.log(`get: ${response.status} ${response.statusText} ${url}`);
      return response.json().then((data) => callback(null, data));
    })
    .catch((err) => callback(err, null));
}

function getFilter({ credentials, filterId, optionsOverride = {} }, callback) {
  const url = `https://talentsoft.atlassian.net/rest/api/3/filter/${filterId}`;
  return module.exports.get({ credentials, url, optionsOverride }, callback);
}

module.exports = {
  get,
  getFilter,
};
