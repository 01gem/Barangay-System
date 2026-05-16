<?php
require_once __DIR__ . '/../common.php';
$db = get_db();

$rows = [];

try {
  $sql = "SELECT id, reference_no, resident_name, resident_email, document_type, purpose, date_requested, status
    FROM document_requests
    ORDER BY id DESC";
  $stmt = $db->prepare($sql);
  if (!$stmt) json_error('Failed to prepare requests query.', 500);
  $rows = db_query_all($stmt);
  $stmt->close();
} catch (mysqli_sql_exception $e) {
  $sql = "SELECT id, reference_no, document_type, purpose, date_requested, status
    FROM document_requests
    ORDER BY id DESC";
  $stmt = $db->prepare($sql);
  if (!$stmt) json_error('Failed to prepare fallback requests query.', 500);
  $rows = db_query_all($stmt);
  $stmt->close();
}

json_success(['requests' => $rows]);
?>
