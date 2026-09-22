/**
 * Birthday Email Reminder System
 * Public, sanitized reference implementation.
 *
 * Expected source columns (A:C):
 * A = person name
 * B = date of birth
 * C = email
 */

function sendBirthdayReminders() {
  var config = getBirthdayConfig_();
  var managementBook = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = SpreadsheetApp
    .openById(config.sourceSpreadsheetId)
    .getSheetByName(config.sourceSheetName);

  if (!sourceSheet) {
    throw new Error('Birthday source sheet not found: ' + config.sourceSheetName);
  }

  var personalCardsSheet = managementBook.getSheetByName(config.personalCardsSheetName);
  var monthlyDesignsSheet = managementBook.getSheetByName(config.monthlyDesignsSheetName);
  var exclusionsSheet = managementBook.getSheetByName(config.monthlyExclusionsSheetName);

  var sourceRows = sourceSheet.getDataRange().getValues();
  var personalCards = readPersonalCards_(personalCardsSheet);
  var monthlyDesigns = readMonthlyDesigns_(monthlyDesignsSheet);
  var monthlyExclusions = readMonthlyExclusions_(exclusionsSheet);

  var today = new Date();
  var dayToday = today.getDate();
  var monthToday = today.getMonth() + 1;
  var activeMonthlyRecipients = [];

  for (var i = 1; i < sourceRows.length; i++) {
    var row = sourceRows[i];
    var personName = row[0];
    var dateOfBirth = row[1];
    var email = normalizeEmail_(row[2]);

    if (!email) continue;

    if (!monthlyExclusions[email]) {
      activeMonthlyRecipients.push(email);
    }

    if (!(dateOfBirth instanceof Date)) continue;

    var birthdayDay = dateOfBirth.getDate();
    var birthdayMonth = dateOfBirth.getMonth() + 1;

    if (dayToday === birthdayDay && monthToday === birthdayMonth) {
      sendPersonalBirthdayCard_(personName, email, personalCards[email], config, i + 1);
    }
  }

  if (dayToday === config.monthlySendDay) {
    sendMonthlyBirthdayAnnouncement_(monthToday, activeMonthlyRecipients, monthlyDesigns[monthToday], config);
  }
}

/** Backward-compatible Spanish entry point. */
function enviarRecordatoriosCumpleanos() {
  return sendBirthdayReminders();
}

function getBirthdayConfig_() {
  var props = PropertiesService.getScriptProperties();
  var sourceSpreadsheetId = String(props.getProperty('BIRTHDAY_SOURCE_SPREADSHEET_ID') || '').trim();
  var adminEmail = normalizeEmail_(props.getProperty('ADMIN_EMAIL'));

  if (!sourceSpreadsheetId) {
    throw new Error('Missing Script Property: BIRTHDAY_SOURCE_SPREADSHEET_ID');
  }
  if (!adminEmail) {
    throw new Error('Missing Script Property: ADMIN_EMAIL');
  }

  return {
    sourceSpreadsheetId: sourceSpreadsheetId,
    sourceSheetName: String(props.getProperty('BIRTHDAY_SOURCE_SHEET') || 'nacimiento').trim(),
    personalCardsSheetName: String(props.getProperty('PERSONAL_CARDS_SHEET') || 'tarjetas_personales').trim(),
    monthlyDesignsSheetName: String(props.getProperty('MONTHLY_DESIGNS_SHEET') || 'disenos_mensuales').trim(),
    monthlyExclusionsSheetName: String(props.getProperty('MONTHLY_EXCLUSIONS_SHEET') || 'excluidos_mensual').trim(),
    adminEmail: adminEmail,
    organizationName: String(props.getProperty('ORGANIZATION_NAME') || 'Your organization').trim(),
    language: String(props.getProperty('LANGUAGE') || 'en').trim().toLowerCase() === 'es' ? 'es' : 'en',
    monthlySendDay: parseMonthlySendDay_(props.getProperty('MONTHLY_SEND_DAY'))
  };
}

function readPersonalCards_(sheet) {
  var map = {};
  if (!sheet || sheet.getLastRow() < 2) return map;

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    var email = normalizeEmail_(values[i][0]);
    var link = String(values[i][1] || '').trim();
    if (email && link) map[email] = link;
  }
  return map;
}

function readMonthlyDesigns_(sheet) {
  var map = {};
  if (!sheet || sheet.getLastRow() < 2) return map;

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    var month = Number(values[i][0]);
    var link = String(values[i][1] || '').trim();
    if (month >= 1 && month <= 12 && link) map[month] = link;
  }
  return map;
}

function readMonthlyExclusions_(sheet) {
  var set = {};
  if (!sheet || sheet.getLastRow() < 2) return set;

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    var email = normalizeEmail_(values[i][1]);
    if (email) set[email] = true;
  }
  return set;
}

function sendPersonalBirthdayCard_(personName, recipientEmail, cardLink, config, sourceRowNumber) {
  if (!cardLink) return;

  var fileId = extractDriveFileId_(cardLink);
  if (!fileId) return;

  try {
    var imageBlob = DriveApp.getFileById(fileId).getBlob();
    var subject = birthdaySubject_(personName, config);
    var html = '<div style="text-align:center;"><img src="cid:birthdayCard" style="width:100%;max-width:800px;border-radius:8px;"></div>';

    GmailApp.sendEmail(recipientEmail, subject, subject, {
      htmlBody: html,
      inlineImages: { birthdayCard: imageBlob }
    });

    var adminHtml = '<p>A personalized birthday card was sent successfully for source row <strong>' + sourceRowNumber + '</strong>.</p>';
    GmailApp.sendEmail(config.adminEmail, adminConfirmationSubject_(config), 'Birthday card sent.', {
      htmlBody: adminHtml
    });
  } catch (error) {
    console.error('Personal birthday email failed for source row ' + sourceRowNumber + ': ' + error.message);
  }
}

function sendMonthlyBirthdayAnnouncement_(month, recipients, monthlyCardLink, config) {
  if (!monthlyCardLink || recipients.length === 0) return;

  var fileId = extractDriveFileId_(monthlyCardLink);
  if (!fileId) return;

  try {
    var imageBlob = DriveApp.getFileById(fileId).getBlob();
    var subject = monthlySubject_(month, config);
    var html = '<div style="text-align:center;"><img src="cid:monthlyCard" style="width:100%;max-width:800px;border-radius:8px;"></div>';

    console.log('Monthly birthday announcement recipient count: ' + recipients.length);

    GmailApp.sendEmail(config.adminEmail, subject, ' ', {
      bcc: recipients.join(','),
      htmlBody: html,
      inlineImages: { monthlyCard: imageBlob }
    });
  } catch (error) {
    console.error('Monthly birthday announcement failed: ' + error.message);
  }
}

function birthdaySubject_(personName, config) {
  if (config.language === 'es') {
    return config.organizationName + ' te desea un ¡Feliz Cumpleaños, ' + personName + '!';
  }
  return 'Happy Birthday, ' + personName + '! — ' + config.organizationName;
}

function monthlySubject_(month, config) {
  var monthName = monthName_(month, config.language);
  if (config.language === 'es') {
    return 'Acompáñanos a felicitar a los cumpleañeros de ' + monthName + ' — ' + config.organizationName;
  }
  return 'Join us in celebrating our ' + monthName + ' birthdays — ' + config.organizationName;
}

function adminConfirmationSubject_(config) {
  return config.language === 'es'
    ? 'CONFIRMACIÓN DEL SISTEMA: tarjeta de cumpleaños enviada'
    : 'SYSTEM CONFIRMATION: birthday card sent';
}

function monthName_(month, language) {
  var monthsEs = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var monthsEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var list = language === 'es' ? monthsEs : monthsEn;
  return list[month - 1] || String(month);
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function parseMonthlySendDay_(value) {
  var day = Number(value || 1);
  return day >= 1 && day <= 28 ? day : 1;
}

function extractDriveFileId_(url) {
  if (!url) return null;
  var text = String(url).trim();
  var match = text.match(/[?&]id=([^&]+)/) || text.match(/\/d\/([^/]+)/);
  return match ? match[1] : null;
}
