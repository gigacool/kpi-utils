# kpi-utils

This project describes utilities to gather, process and produce metrics and KPI from data sources.

## JIRA

The idea is to gather tickets from a filter query. From the tickets, we will gather some attributes based on a given configuration and produce calculated metrics. An output will be produced to be piped in another system. 

* credential parameters are required from .env file (see dotenv for details)
    * JIRA_USERNAME 
    * JIRA_USER_TOKEN
    * JIRA_BASE_URL 


