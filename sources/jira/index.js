require('dotenv').config();

const issues = require('./issues');
const configuration = require('../../configuration/jira.json');

const defaultOptions = {
  credentials: {
    username: process.env.JIRA_USERNAME,
    token: process.env.JIRA_USER_TOKEN,
  },
  baseUrl: process.env.JIRA_BASE_URL,
  fields: configuration.fields,
};

module.exports = {
  getIssue: issues.getIssueCurry(defaultOptions),
};
