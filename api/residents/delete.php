<?php
require_once __DIR__ . '/../common.php';
require_post();
$db = get_db();
$input = read_json_input();
$portalSource = $_SERVER['HTTP_X_PORTAL_SOURCE'] ?? '';
if ($portalSource !== 'official') {
  json_error('Only barangay official portal can delete residents.', 403);
}

$id = (int)($input['resident_id'] ?? 0);
if ($id <= 0) {
  json_error('Valid resident id is required.');
}

$stmt = $db->prepare("DELETE FROM residents WHERE id = ?");
if (!$stmt) json_error('Failed to prepare resident delete.', 500);
$stmt->bind_param('i', $id);
if (!$stmt->execute()) {
  json_error('Failed to delete resident: ' . $stmt->error, 500);
}
$stmt->close();

json_success(['message' => 'Resident deleted successfully.']);
?>
