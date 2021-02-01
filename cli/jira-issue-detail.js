const fs = require('fs');
const { getPath } = require('../sources/utils');
const { jira } = require('../sources/index');
const { cli } = require('./cli-core');

const args = cli.argv;

const options = { issue: args.issue, url: args.url };

const { output, raw } = args;

jira.getIssue({...options, rawData: !!raw}, (data) => {
  if (!output) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  const fileName = getPath(output);
  fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf-8', () => {
    console.log('Operation success');
    console.log('output can be found here:');
    console.log(fileName);
  });
});
