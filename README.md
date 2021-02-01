# kpi-utils

This project describes utilities to gather, process and produce metrics and KPI from data sources.

## JIRA

The idea is to gather tickets from a filter query. From the tickets, we will gather some attributes based on a given configuration and produce calculated metrics. An output will be produced to be piped in another system. 

* credential parameters are required from .env file (see dotenv for details)
    * JIRA_USERNAME 
    * JIRA_USER_TOKEN
    * JIRA_BASE_URL 

### Getting started 

Running a script:

``` 
node .\cli\jira-issue-detail.js -i REC-55647 -o test.json
```
where **i** describes the issue reference, and **o** the output file. If no output file is provided, the answer is directed to the console.
The data returned is transformed from the data provided from jira. In order to access raw data, please provide the **-r true** parameter to the command line.

Using the debugger:

``` 
 $env:NODE_DEBUG='api-client' ; node .\cli\jira-issue-detail.js -i REC-55647 -o test.json
```

