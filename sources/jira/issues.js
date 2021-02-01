const moment = require('moment');
const client = require('./api-client');
const utils = require('../utils');
const { result } = require('lodash');

const constants = require('../../configuration/jira.json');
const { duration } = require('moment');

// issue conversion

function convertHistory(jiraIssueHistory, fromSprint = true) {
  return jiraIssueHistory.values
    .reduce(_getStatusChanges, [])
    .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  function _getStatusChanges(result, entry) {
      let inSprint = !fromSprint;
      // entry.items contains all field changes for a given issue update in history
      const statusChange = entry.items.reduce((defaultValue, item)=>{
        if (!inSprint && 'sprint' === item.field) {
          inSprint = true;
          return defaultValue;
        }
        if ('status' === item.field) {
          return {
            from: item.fromString,
            to: item.toString,
            date: entry.created,
          };
        }
        return defaultValue;
      }, null);
      if (statusChange) {
        result.push(statusChange);
      }
      return result;
  }
}

function statusSummary(statusHistory){
  return statusHistory.reduce((summary, state)=>{
    let key = `${state.from} -> ${state.to}`;
    summary[key] = summary[key] || 0;
    summary[key]++;
    return summary;
  }, {})
}

function statusDuration(statusHistory) {

  let duration = {};
  if (statusHistory.length <1 ) { return duration; }

  let previous = statusHistory[0].date;
  for (let i = 1; i < statusHistory.length; i++) {
    let state = statusHistory[i];
    let stateDuration = moment.duration(moment.utc(state.date).diff(moment.utc(previous))).asHours();
    duration[state.from] = duration[state.from] ? duration[state.from] + stateDuration : stateDuration;
    previous = statusHistory[i].date;
  }

  return duration;
}

function lastStatusChange(statusHistory){
  if(statusHistory.length < 1) return 0;
  return moment.utc(statusHistory[statusHistory.length-1].date).format('DD/MM/YYYY');
}

function historyDuration(statusHistory){
  if (statusHistory.length < 2) return 0;
  let start = statusHistory[0].date;
  let end = statusHistory[statusHistory.length-1].date;
  return  moment.duration(moment.utc(end).diff(moment.utc(start))).asHours();
}

function convert(jiraIssue, jiraIssueHistory) {
  const { key, fields, self } = jiraIssue;

  let result = {
    key: key,
    url: self,
    issueType:fields.issuetype.name,
    summary: fields.summary,
    labels:fields.labels,
    priority:fields.priority.name,
  }

  {
    // status history
    let statusHistory = convertHistory(jiraIssueHistory);
    result.status = {
      current: fields.status.name,
      category: fields.status.statusCategory.name,
      history: statusHistory,
      length: statusHistory.length,
      duration: {...statusDuration(statusHistory), total: historyDuration(statusHistory) },
      lastChange: lastStatusChange(statusHistory),
      summary: statusSummary(statusHistory)
    }
  }
  {
    // sprints
    let sprints = (fields[constants.fields.SPRINTS] || []).map((sprint)=>sprint.name)
    result.sprints=sprints;
    result.sprintCount=sprints.length;
  }
  {
    // subtasks
    let subtasks = (fields.subtasks || []).map((task)=>task.id)
    result.subtasks = { 
      tasks: subtasks,
      length: subtasks.length
    }
  }
  {
    // patch horror & friends
    let patchType = (fields[constants.fields.PATCH_TYPE] || {value:null}).value;
    result.patchType = patchType;
    let severity = (fields[constants.fields.SEVERITY] || {value:null}).value;
    result.severity = severity;
  }
  {
    // extra
    result.storyPoints = fields[constants.fields.STORY_POINTS];
    result.productLine = fields[constants.fields.PRODUCT_LINE].value;
  }

  return result;
}

function getIssueCurry(defaultOptions) {
  return function getIssue(options, callback = () => {}) {
    let url = `${options.url || defaultOptions.baseUrl}/rest/api/3/issue/${options.issue}`;
    const { credentials } = defaultOptions;

    const promise = new Promise((resolve, reject) => {
      client.get({ credentials, url }, (issueError, data) => {
        utils.processError(issueError, reject);
        // history
        url = `${data.self}/changelog?maxResults=1000`;
        client.get({ credentials, url }, (historyError, history) => {
          utils.processError(historyError, reject);
          if (options.rawData){
            let raw = {
              ...data,
              history: history
            };
            callback(raw);
            resolve(raw);
            return;
          }
          const result  = convert(data, history);
          callback(result);
          resolve(result);
        });
      });
    });

    return promise;
  };
}

module.exports = {
  getIssueCurry,
  _convertHistory: convertHistory,
};
