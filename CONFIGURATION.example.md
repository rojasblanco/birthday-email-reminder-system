# Configuration example

Store deployment-specific values as **Google Apps Script Script Properties**. Do not hardcode real production identifiers or email addresses in the public repository.

| Property | Required | Example | Purpose |
|---|---:|---|---|
| `BIRTHDAY_SOURCE_SPREADSHEET_ID` | yes | `YOUR_SOURCE_SPREADSHEET_ID` | Spreadsheet containing name, birthday and email |
| `ADMIN_EMAIL` | yes | `automation-admin@example.org` | Receives system confirmations and is used as the visible TO address for monthly BCC mailings |
| `BIRTHDAY_SOURCE_SHEET` | no | `nacimiento` | Source sheet name; default `nacimiento` |
| `PERSONAL_CARDS_SHEET` | no | `tarjetas_personales` | Personal card mapping sheet |
| `MONTHLY_DESIGNS_SHEET` | no | `disenos_mensuales` | Monthly artwork mapping sheet |
| `MONTHLY_EXCLUSIONS_SHEET` | no | `excluidos_mensual` | Monthly opt-out sheet |
| `ORGANIZATION_NAME` | no | `Example Research Center` | Used in email subjects |
| `LANGUAGE` | no | `es` | `es` or `en`; default `en` |
| `MONTHLY_SEND_DAY` | no | `1` | Day of month used for the monthly announcement; accepted range 1–28 |

## Expected source columns

The birthday source currently uses the first three columns:

```text
A: Name
B: Date of birth
C: Email
```

The public implementation intentionally does not include the real personnel spreadsheet ID.

## Trigger

Create one daily time-driven trigger for:

```text
sendBirthdayReminders
```

Choose a time appropriate for the organization and make sure the Apps Script project timezone is correct.
