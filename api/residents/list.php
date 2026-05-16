<?php
require_once __DIR__ . '/../common.php';
$db = get_db();

$sql = "SELECT id, fname, lname, address, contact, email FROM residents ORDER BY id DESC";
$stmt = $db->prepare($sql);
if (!$stmt) json_error('Failed to prepare residents query.', 500);
$rows = db_query_all($stmt);
$stmt->close();

json_success(['residents' => $rows]);
?>
