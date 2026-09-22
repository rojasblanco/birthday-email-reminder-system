# Birthday Email Reminder System

[Versión en español](README.es.md)

A lightweight Google Apps Script automation for birthday communications inside an organization. It connects a personnel birthday source with Drive-hosted birthday cards and automatically sends two types of email:

- a **personal birthday card** sent directly to the person on the exact date of their birthday;
- a **monthly birthday announcement** sent to the active recipient list so the team knows which members have birthdays during that month.

The public repository is a sanitized, configurable reference implementation. It contains no real personnel data, production email addresses, private Drive IDs, or organizational database identifiers.

## Why the system exists

The need for an email-based birthday reminder process emerged as an **operational requirement assigned within the team**. From that requirement, the repository author designed and developed the automation structure that turns the process into a maintainable workflow. Instead of managing every birthday manually, it links:

```text
Personnel birthday source
        ↓
Name + date of birth + email
        ↓
Email-based card mapping
        ↓
Drive-hosted birthday artwork
        ↓
Google Apps Script
        ↓
Personal greeting + monthly announcement
```

The design team, communications team, or any authorized person can prepare the artwork. The automation only needs the corresponding Drive link.

## What the system does

### 1. Reads the birthday source

The source spreadsheet is expected to provide:

| Column | Meaning |
|---|---|
| A | Person name |
| B | Date of birth |
| C | Email |

The production source can be an existing personnel database or another authorized spreadsheet.

### 2. Sends a personal birthday card

When today's day and month match a person's birthday, the system sends an **individual greeting directly to the birthday person on the corresponding date**. To do this, it:

1. matches the person's email to the personal-card table;
2. retrieves the corresponding image from Google Drive;
3. embeds the image in an email;
4. sends the birthday greeting to that person;
5. sends an administrative confirmation to the configured administrator.

### 3. Sends a monthly birthday announcement

On the configured day of each month, the system sends a **general team announcement identifying the members who have birthdays during the current month**. To do this, it:

1. selects the monthly artwork for the current month;
2. builds the active recipient list from the birthday source;
3. removes emails listed in the monthly exclusion table;
4. sends the monthly image using BCC so recipients do not see the full mailing list.

### 4. Supports monthly exclusions

The exclusion list is intended for people who should not receive the **monthly group announcement**.

The current reference behavior keeps the personal birthday greeting independent from that monthly exclusion list. If an organization wants one opt-out to suppress both message types, that policy should be implemented explicitly.

## Management spreadsheet

The system uses three management sheets:

| Sheet | Purpose |
|---|---|
| `tarjetas_personales` | Maps each person's email to the Drive link of their personal birthday card |
| `disenos_mensuales` | Maps month numbers 1–12 to the Drive link of each monthly announcement card |
| `excluidos_mensual` | Contains people/emails excluded from the monthly group announcement |

Sheet names are configurable through Script Properties, so English or other naming conventions can be used.

## Example workbooks

Two sanitized examples are included:

- `data/birthday_reminder_management_example_en.xlsx`
- `data/sistema_recordatorios_cumpleanos_ejemplo_es.xlsx`

Each example also includes a fictitious birthday-source sheet so the expected source structure is visible. All names, addresses and Drive links are fictional placeholders.

## Configuration

Production-specific values must be stored in **Google Apps Script Script Properties**, not hardcoded in the repository.

Required:

- `BIRTHDAY_SOURCE_SPREADSHEET_ID`
- `ADMIN_EMAIL`

Optional:

- `BIRTHDAY_SOURCE_SHEET`
- `PERSONAL_CARDS_SHEET`
- `MONTHLY_DESIGNS_SHEET`
- `MONTHLY_EXCLUSIONS_SHEET`
- `ORGANIZATION_NAME`
- `LANGUAGE` (`en` or `es`)
- `MONTHLY_SEND_DAY`

See [CONFIGURATION.example.md](CONFIGURATION.example.md).

## Automation

Create a time-driven Apps Script trigger that runs:

`sendBirthdayReminders`

once per day. The script checks whether a personal birthday greeting or the monthly announcement is due.

The Apps Script project timezone must match the organization's operational timezone.

## Drive cards

The birthday images remain in Google Drive. The account that executes the Apps Script must have sufficient access to read those files.

Do not make files publicly editable merely to make the automation work. Use the minimum access necessary for the executing account.

## Security and privacy

Birth dates and email addresses are personal data. The real birthday database, real card links, production email addresses, Drive IDs, and operational logs should remain outside the public repository.

Monthly announcements use BCC to avoid exposing the complete recipient list to every recipient.

See [SECURITY.md](SECURITY.md).

## Project provenance

The need to implement birthday reminders by email emerged as an **operational requirement assigned within the team**. From that requirement, the repository author **independently designed and developed the complete automation system that operationalizes the process**, including the linkage to the personnel birthday source, email-based identity matching, personal-card and monthly-card structures, Drive image retrieval, exclusion handling, Gmail delivery logic, and administrative confirmation workflow.

The organizational environment provided the real operational need, personnel-data structure, communication context, and artwork workflow. The public repository intentionally removes private organizational data and identifiers.

See [PROVENANCE.md](PROVENANCE.md).

## Current limitations

- The implementation depends on Google Apps Script and Gmail quotas.
- The source currently assumes name, date of birth and email are in columns A:C.
- Drive cards must remain accessible to the executing account.
- The monthly exclusion list currently affects only the monthly group announcement.
- The system does not include a user-facing administration portal.
- The reference implementation does not maintain a separate delivery-history database.

## Possible future improvements

- delivery history and resend controls;
- automated checks for missing birthday cards;
- a dashboard showing birthdays/cards still needing artwork;
- optional opt-out policy covering both personal and monthly messages;
- configurable HTML templates in addition to image-only emails;
- automatic alerts when Drive permissions are insufficient.

## Status and license

**Status:** Functional reference implementation / iterative maintenance.

The sanitized source code and documentation in this repository are distributed under the [MIT License](LICENSE).

The license applies to the material published in this repository. Real personnel data, credentials, private organizational databases, private Drive resources, artwork owned by other parties, and other non-public assets are not included in this repository.

---

**Stack:** Google Apps Script · Google Sheets · Google Drive · Gmail
