<?php
require_once __DIR__ . '/../common.php';
require_post();
$db = get_db();
$input = read_json_input();

$category = trim((string)($input['category'] ?? ''));
$location = trim((string)($input['location_text'] ?? ''));
$description = trim((string)($input['description'] ?? ''));
if ($category === '' || $location === '' || $description === '') {
  json_error('Category, location, and description are required.');
}

$prefix = 'CSR-' . date('Ymd') . '-';
$ref = $prefix . strtoupper(substr(md5(uniqid((string)mt_rand(), true)), 0, 6));
$residentName = 'Resident User';
$dateFiled = date('M d, Y');
$status = 'open';
$note = 'Received. Awaiting assignment.';

$stmt = $db->prepare("INSERT INTO complaints (reference_no, resident_name, category, location_text, description, date_filed, status, official_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) json_error('Failed to prepare complaint insert.', 500);
$stmt->bind_param('ssssssss', $ref, $residentName, $category, $location, $description, $dateFiled, $status, $note);
if (!$stmt->execute()) {
  json_error('Failed to submit complaint: ' . $stmt->error, 500);
}
$stmt->close();

json_success(['reference_no' => $ref, 'message' => 'Complaint submitted successfully.']);
?>
