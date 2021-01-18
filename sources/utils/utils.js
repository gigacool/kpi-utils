/* eslint-disable no-console */

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

module.exports = {
  processError,
};
