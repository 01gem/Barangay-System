<?php
require_once __DIR__ . '/../common.php';
require_once __DIR__ . '/../../phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../../phpmailer/src/SMTP.php';
require_once __DIR__ . '/../../phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_post();

$db = get_db();
$input = read_json_input();
$portalSource = $_SERVER['HTTP_X_PORTAL_SOURCE'] ?? '';
if ($portalSource !== 'official') {
  json_error('Only barangay official portal can send pickup notifications.', 403);
}

$referenceNo = trim((string)($input['reference_no'] ?? ''));
$emailOverride = trim((string)($input['email'] ?? ''));
if ($referenceNo === '') {
  json_error('Request reference number is required.');
}
if ($emailOverride !== '' && !filter_var($emailOverride, FILTER_VALIDATE_EMAIL)) {
  json_error('Provided email is invalid.');
}

$reqStmt = $db->prepare("SELECT id, reference_no, resident_id, resident_name, resident_email, document_type, status FROM document_requests WHERE reference_no = ? LIMIT 1");
if (!$reqStmt) json_error('Failed to prepare request lookup.', 500);
$reqStmt->bind_param('s', $referenceNo);
$rows = db_query_all($reqStmt);
$reqStmt->close();
if (count($rows) === 0) {
  json_error('Document request not found.', 404);
}
$request = $rows[0];

$residentEmail = $emailOverride;
if ($residentEmail === '') {
  $residentEmail = trim((string)($request['resident_email'] ?? ''));
}
if ($residentEmail === '' && !empty($request['resident_id'])) {
  $rid = (int)$request['resident_id'];
  $resById = $db->prepare("SELECT email FROM residents WHERE id = ? LIMIT 1");
  if ($resById) {
    $resById->bind_param('i', $rid);
    $resByIdRows = db_query_all($resById);
    $resById->close();
    if (count($resByIdRows) > 0) {
      $residentEmail = (string)$resByIdRows[0]['email'];
    }
  }
}
if ($residentEmail === '') {
  $residentName = trim((string)$request['resident_name']);
  if ($residentName !== '') {
    $resStmt = $db->prepare("SELECT email FROM residents WHERE CONCAT(fname, ' ', lname) = ? LIMIT 1");
    if ($resStmt) {
      $resStmt->bind_param('s', $residentName);
      $resRows = db_query_all($resStmt);
      $resStmt->close();
      if (count($resRows) > 0) {
        $residentEmail = (string)$resRows[0]['email'];
      }
    }
  }
}

if ($residentEmail === '') {
  json_error('Resident email not found. Enter the email manually when notifying.', 400);
}

$subject = 'Barangay Document Ready for Pickup';
$safeResident = $request['resident_name'] !== '' ? $request['resident_name'] : 'Resident';
$message = "Hello {$safeResident},\n\n"
  . "Your requested document ({$request['document_type']}) with reference number {$request['reference_no']} is now ready for pickup at the Barangay Hall.\n\n"
  . "Please bring a valid ID when claiming your document.\n"
  . "A document processing fee applies and will be discussed at the barangay hall during pickup.\n\n"
  . "Thank you.\nBarangay Official Portal";

// ===== PHPMailer Configuration =====
// Set the following environment variables in your .env or system:
// PHPMAILER_HOST: Your SMTP server (e.g., smtp.gmail.com, smtp.mailtrap.io)
// PHPMAILER_PORT: SMTP port (e.g., 587 for TLS, 465 for SSL)
// PHPMAILER_USERNAME: SMTP username/email address
// PHPMAILER_PASSWORD: SMTP password
// PHPMAILER_FROM_EMAIL: Sender email address (e.g., noreply@barangay.com)
// PHPMAILER_FROM_NAME: Sender name (e.g., BarangayLink of Sampaguita)
// PHPMAILER_ENCRYPTION: TLS or SSL (default: tls)
// ====================================

$smtpHost = getenv('PHPMAILER_HOST');
$smtpPort = (int)(getenv('PHPMAILER_PORT') ?: 587);
$smtpUsername = getenv('PHPMAILER_USERNAME');
$smtpPassword = getenv('PHPMAILER_PASSWORD');
$senderEmail = getenv('PHPMAILER_FROM_EMAIL') ?: 'noreply@example.com';
$senderName = getenv('PHPMAILER_FROM_NAME') ?: 'BarangayLink';
$encryption = getenv('PHPMAILER_ENCRYPTION') ?: 'tls';

if (!$smtpHost || !$smtpUsername || !$smtpPassword) {
  json_error('PHPMailer SMTP configuration is missing. Check your environment variables.', 500);
}

try {
  $mail = new PHPMailer(true);

  $mail->isSMTP();
  $mail->Host = $smtpHost;
  $mail->Port = $smtpPort;
  $mail->SMTPAuth = true;
  $mail->Username = $smtpUsername;
  $mail->Password = $smtpPassword;
  $mail->SMTPSecure = strtolower($encryption) === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;

  $mail->setFrom($senderEmail, $senderName);
  $mail->addAddress($residentEmail, $safeResident);
  $mail->Subject = $subject;
  $mail->Body = $message;
  $mail->isHTML(false);

  $mail->send();
} catch (Exception $e) {
  json_error('Email send failed: ' . $mail->ErrorInfo, 500);
}

$status = 'ready';
$upStmt = $db->prepare("UPDATE document_requests SET status = ? WHERE id = ?");
if (!$upStmt) json_error('Failed to prepare request status update.', 500);
$requestId = (int)$request['id'];
$upStmt->bind_param('si', $status, $requestId);
if (!$upStmt->execute()) {
  json_error('Failed to update request status: ' . $upStmt->error, 500);
}
$upStmt->close();

json_success([
  'message' => "Pickup notice sent to {$residentEmail}. Fee reminder included without showing exact amount."
]);
?>
