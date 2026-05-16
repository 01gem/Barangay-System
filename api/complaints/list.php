<?php
require_once __DIR__ . '/../common.php';
$db = get_db();

$sql = "SELECT id, reference_no, resident_name, category, location_text, description, date_filed, status, official_note
        FROM complaints
        ORDER BY id DESC";
$stmt = $db->prepare($sql);
if (!$stmt) json_error('Failed to prepare complaints query.', 500);
$rows = db_query_all($stmt);
$stmt->close();

json_success(['complaints' => $rows]);
?>
