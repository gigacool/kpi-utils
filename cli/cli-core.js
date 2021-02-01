const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const cli = yargs(hideBin(process.argv))
  .usage('usage: -i <issue-reference> -u <jira-url> --o <output-file>')
  .command('jira-issue', 'provide summary information on jira issue')
  .option('i', {
    alias: 'issue', describe: 'issue reference', type: 'string', demandOption: true,
  })
  .option('u', {
    alias: 'url', describe: 'jira server url', type: 'string', demandOption: false,
  })
  .option('o', {
    alias: 'output', describe: 'target file', type: 'string', demandOption: false,
  })
  .option('r', {
    alias: 'raw', describe: 'raw data', type: 'boolean', demandOption: false,
  })
  .help('h');
  // .argv;

module.exports = {
  cli,
};
