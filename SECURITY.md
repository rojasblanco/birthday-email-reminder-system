# Security and privacy

## Public repository scope

This repository is a sanitized reference implementation. It must not contain real personnel data, real birth dates, production email addresses, private Google Drive IDs, private spreadsheet IDs, credentials, operational artwork, or private logs.

## Personal data

Birth dates and email addresses are personal data. Keep the production birthday source in an access-controlled organizational location and grant access only to people and service accounts that need it.

## Google Drive artwork

The Apps Script execution account needs permission to read the birthday-card image files. Prefer least-privilege sharing. Public edit access is not required and should not be used merely to make the automation work.

## Email privacy

The monthly announcement uses BCC so recipients do not receive the complete mailing list in the message headers.

## Configuration

Keep production identifiers and addresses in Script Properties:

- source spreadsheet ID;
- administrator email;
- organization name;
- deployment-specific sheet names.

Do not commit real values to GitHub.

## Logs

Avoid logging complete recipient lists or personal data. The public reference code logs only aggregate delivery information and row-level error context.

## Exclusions

The current exclusion table applies to the monthly group announcement. If organizational policy requires an opt-out from the personal birthday greeting too, update the logic and document that policy before deployment.
