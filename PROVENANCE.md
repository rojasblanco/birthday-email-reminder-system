# Project provenance

## Origin

The need for an email-based birthday reminder process emerged as an **operational requirement assigned within the team**.

From that requirement, the repository author **independently designed and developed the complete automation system** that turns the task into a structured, repeatable workflow.

## Author contribution

The author's contribution includes:

- defining the system architecture;
- linking the automation to an existing personnel birthday source;
- using email as the stable matching key between personnel records and birthday cards;
- defining the personal-card mapping table;
- defining the monthly-design table;
- defining the monthly exclusion workflow;
- retrieving Drive-hosted artwork programmatically;
- sending personal birthday greetings directly to each birthday person on the corresponding date;
- sending monthly birthday announcements through BCC so the wider team knows which members have birthdays during that month;
- implementing administrative delivery confirmations;
- preparing a sanitized and configurable public implementation.

## Organizational context

The organization supplied the real operational context, the personnel-data structure, the communication need and the workflow through which birthday artwork is designed and maintained.

The public repository intentionally excludes real organizational data, production identifiers, private Drive resources, real email addresses and artwork that is not owned or licensed for public redistribution.

## Public release

This repository documents the automation layer rather than the organization's personnel database or design assets.

The source code and documentation published here are distributed under the MIT License. The license does not include private datasets, credentials, private Google Workspace resources, real birthday cards, trademarks, or other materials that are not present in this repository.
