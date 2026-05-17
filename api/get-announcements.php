<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$db = get_db();

$stmt = $db->prepare('SELECT id, title, excerpt, category, created_at FROM announcements ORDER BY created_at DESC LIMIT 6');
if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database query failed']);
  exit;
}

$result = $stmt->get_result();
$announcements = $result->fetch_all(MYSQLI_ASSOC);

$formatted = array_map(function($a) {
  return [
    'id' => $a['id'],
    'title' => $a['title'],
    'excerpt' => $a['excerpt'],
    'cat' => strtolower($a['category']),
    'catLabel' => $a['category'],
    'date' => substr($a['created_at'], 0, 10)
  ];
}, $announcements);

echo json_encode([
  'success' => true,
  'data' => $formatted
]);
?>
