/* eslint-disable no-console */
const path = require('path');

function processError(err) {
  if (err) {
    switch (typeof err) {
      case 'object':
        console.error(JSON.stringify(err, null, 2));
        break;
      default:
        console.error(err);
        break;
    }
    process.exit(-1);
  }
}

function getPath(fileName) {
  if (path.isAbsolute(fileName)) {
    return path.normalize(fileName);
  }
  return path.normalize(path.join(process.cwd(), fileName));
}

module.exports = {
  processError,
  getPath,
};
