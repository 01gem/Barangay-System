<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$db = get_db();

// Count registered residents
$stmt = $db->prepare('SELECT COUNT(*) as count FROM residents');
$stmt->execute();
$result = $stmt->get_result();
$residents_count = $result->fetch_assoc()['count'];

// Count verified local services
$stmt = $db->prepare('SELECT COUNT(*) as count FROM businesses WHERE is_verified = 1');
$stmt->execute();
$result = $stmt->get_result();
$services_count = $result->fetch_assoc()['count'];

// Calculate request fulfillment rate
$stmt = $db->prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = "ready" OR status = "processing" THEN 1 ELSE 0 END) as fulfilled FROM document_requests');
$stmt->execute();
$result = $stmt->get_result();
$request_data = $result->fetch_assoc();
$fulfillment_rate = $request_data['total'] > 0 ? round(($request_data['fulfilled'] / $request_data['total']) * 100) : 0;

// Calculate average response time (in minutes)
$stmt = $db->prepare('SELECT AVG(TIMESTAMPDIFF(MINUTE, date_filed, NOW())) as avg_time FROM complaints WHERE status = "resolved"');
$stmt->execute();
$result = $stmt->get_result();
$time_data = $result->fetch_assoc();
$avg_response_time = $time_data['avg_time'] ? round($time_data['avg_time']) : 0;

echo json_encode([
  'success' => true,
  'data' => [
    'residents' => (int)$residents_count,
    'services' => (int)$services_count,
    'fulfillment_rate' => (int)$fulfillment_rate,
    'avg_response_time' => (int)$avg_response_time
  ]
]);
?>
