<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$db = get_db();

// Count residents
$stmt = $db->prepare('SELECT COUNT(*) as count FROM residents');
$stmt->execute();
$result = $stmt->get_result();
$residents_count = $result->fetch_assoc()['count'];

// Count pending/processing document requests
$stmt = $db->prepare('SELECT COUNT(*) as count FROM document_requests WHERE status IN ("pending", "processing")');
$stmt->execute();
$result = $stmt->get_result();
$pending_requests_count = $result->fetch_assoc()['count'];

// Count open/investigating complaints
$stmt = $db->prepare('SELECT COUNT(*) as count FROM complaints WHERE status IN ("open", "investigating")');
$stmt->execute();
$result = $stmt->get_result();
$pending_complaints_count = $result->fetch_assoc()['count'];

// Count announcements
$stmt = $db->prepare('SELECT COUNT(*) as count FROM announcements');
$stmt->execute();
$result = $stmt->get_result();
$announcements_count = $result->fetch_assoc()['count'];

// Count verified businesses
$stmt = $db->prepare('SELECT COUNT(*) as count FROM businesses WHERE is_verified = 1');
$stmt->execute();
$result = $stmt->get_result();
$services_count = $result->fetch_assoc()['count'];

echo json_encode([
  'success' => true,
  'data' => [
    'residents' => (int)$residents_count,
    'pending_requests' => (int)$pending_requests_count,
    'pending_complaints' => (int)$pending_complaints_count,
    'announcements' => (int)$announcements_count,
    'services' => (int)$services_count
  ]
]);
?>
