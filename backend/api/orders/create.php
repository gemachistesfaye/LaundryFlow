<?php
/**
 * Create Laundry Order API
 */

require_once '../../config/database.php';
require_once '../../helpers/response.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, "Method Not Allowed");
}

$input = json_decode(file_get_contents("php://input"), true);

$student_id = $input['student_id'] ?? null;
$item_count = $input['item_count'] ?? 0;
$total_price = $input['total_price'] ?? 0.00;
$items = $input['items'] ?? []; // Array of clothing items

if (!$student_id || $item_count <= 0) {
    sendResponse(400, "Student ID and valid item count are required");
}

try {
    $pdo->beginTransaction();

    // 1. Create the order
    $qr_code = 'QR-' . strtoupper(bin2hex(random_bytes(4)));
    $stmt = $pdo->prepare("INSERT INTO laundry_orders (student_id, total_price, item_count, qr_code_data, status) VALUES (?, ?, ?, ?, 'submitted')");
    $stmt->execute([$student_id, $total_price, $item_count, $qr_code]);
    $order_id = $pdo->lastInsertId();

    // 2. Insert individual clothes if provided
    if (!empty($items)) {
        $stmt = $pdo->prepare("INSERT INTO clothes (order_id, student_id, item_name, status, tracking_code) VALUES (?, ?, ?, 'submitted', ?)");
        foreach ($items as $index => $item) {
            $tracking = $qr_code . '-' . ($index + 1);
            $stmt->execute([$order_id, $student_id, $item['name'], $tracking]);
        }
    }

    $pdo->commit();

    sendResponse(201, "Laundry order created successfully", [
        'order_id' => $order_id,
        'qr_code' => $qr_code
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    sendResponse(500, "Error creating order: " . $e->getMessage());
}
?>
