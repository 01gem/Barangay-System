<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$db = get_db();

// Get all categories
$stmt = $db->prepare('SELECT DISTINCT category FROM businesses WHERE is_verified = 1 ORDER BY category');
$stmt->execute();
$result = $stmt->get_result();
$categories = $result->fetch_all(MYSQLI_ASSOC);

// Get all businesses
$stmt = $db->prepare('SELECT id, name, category, description, address, contact, rating, reviews_count FROM businesses WHERE is_verified = 1 ORDER BY rating DESC');
$stmt->execute();
$result = $stmt->get_result();
$businesses = $result->fetch_all(MYSQLI_ASSOC);

$categoryMap = [
  'Food' => '🍽️',
  'Retail' => '🛍️',
  'Services' => '🔧'
];

$formatted = array_map(function($b) use ($categoryMap) {
  $emoji = $categoryMap[$b['category']] ?? '🏪';
  $iconBg = match($b['category']) {
    'Food' => '#FEE2E2',
    'Retail' => '#DBEAFE',
    'Services' => '#FEF3C7',
    default => '#F3F4F6'
  };
  
  return [
    'id' => $b['id'],
    'name' => $b['name'],
    'cat' => strtolower($b['category']),
    'catLabel' => $b['category'],
    'catIcon' => $categoryMap[$b['category']] ?? '🏪',
    'emoji' => $emoji,
    'iconBg' => $iconBg,
    'desc' => $b['description'],
    'addr' => $b['address'],
    'contact' => $b['contact'],
    'rating' => (float)$b['rating'],
    'reviews' => (int)$b['reviews_count']
  ];
}, $businesses);

echo json_encode([
  'success' => true,
  'data' => [
    'filters' => array_merge(['All'], array_map(fn($c) => $c['category'], $categories)),
    'businesses' => $formatted
  ]
]);
?>
