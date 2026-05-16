<?php
require_once __DIR__ . '/../common.php';
require_post();
$db = get_db();
$input = read_json_input();

$documentType = trim((string)($input['document_type'] ?? ''));
$purpose = trim((string)($input['purpose'] ?? ''));
$residentEmail = trim((string)($input['resident_email'] ?? ''));
if ($documentType === '' || $purpose === '') {
  json_error('Document type and purpose are required.');
}

$prefix = 'REQ-' . date('Ymd') . '-';
$ref = $prefix . strtoupper(substr(md5(uniqid((string)mt_rand(), true)), 0, 6));
$residentName = 'Resident User';
$residentEmailToStore = null;

if ($residentEmail !== '' && filter_var($residentEmail, FILTER_VALIDATE_EMAIL)) {
  $resStmt = $db->prepare("SELECT fname, lname, email FROM residents WHERE email = ? LIMIT 1");
  if ($resStmt) {
    $resStmt->bind_param('s', $residentEmail);
    $resRows = db_query_all($resStmt);
    $resStmt->close();
    if (count($resRows) > 0) {
      $row = $resRows[0];
      $residentName = trim(((string)$row['fname']) . ' ' . ((string)$row['lname']));
      $residentEmailToStore = (string)$row['email'];
    }
  }
}

if ($residentEmailToStore === null) {
  $fallbackStmt = $db->prepare("SELECT fname, lname, email FROM residents ORDER BY id ASC LIMIT 1");
  if ($fallbackStmt) {
    $fallbackRows = db_query_all($fallbackStmt);
    $fallbackStmt->close();
    if (count($fallbackRows) > 0) {
      $row = $fallbackRows[0];
      $residentName = trim(((string)$row['fname']) . ' ' . ((string)$row['lname']));
      $residentEmailToStore = (string)$row['email'];
    }
  }
}

$residentEmailToStore = $residentEmailToStore ?: null;
$dateRequested = date('M d, Y');
$status = 'pending';

try {
  $stmt = $db->prepare("INSERT INTO document_requests (reference_no, resident_name, resident_email, document_type, purpose, date_requested, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
  if (!$stmt) json_error('Failed to prepare request insert.', 500);
  $stmt->bind_param('sssssss', $ref, $residentName, $residentEmailToStore, $documentType, $purpose, $dateRequested, $status);
  if (!$stmt->execute()) {
    json_error('Failed to submit request: ' . $stmt->error, 500);
  }
  $stmt->close();
} catch (mysqli_sql_exception $e) {
  try {
    $stmt = $db->prepare("INSERT INTO document_requests (reference_no, resident_name, document_type, purpose, date_requested, status) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) json_error('Failed to prepare fallback request insert.', 500);
    $stmt->bind_param('ssssss', $ref, $residentName, $documentType, $purpose, $dateRequested, $status);
    if (!$stmt->execute()) {
      json_error('Failed to submit request: ' . $stmt->error, 500);
    }
    $stmt->close();
  } catch (mysqli_sql_exception $inner) {
    $stmt = $db->prepare("INSERT INTO document_requests (reference_no, document_type, purpose, date_requested, status) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) json_error('Failed to prepare final fallback request insert.', 500);
    $stmt->bind_param('sssss', $ref, $documentType, $purpose, $dateRequested, $status);
    if (!$stmt->execute()) {
      json_error('Failed to submit request: ' . $stmt->error, 500);
    }
    $stmt->close();
  }
}

json_success(['reference_no' => $ref, 'message' => 'Request submitted successfully.']);
?>
