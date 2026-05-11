<?php
/**
 * Update Order Status API
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

$order_id = $input['order_id'] ?? null;
$worker_id = $input['worker_id'] ?? null;
$status = $input['status'] ?? null; // e.g., 'washing', 'drying', 'ready'

if (!$order_id || !$status) {
    sendResponse(400, "Order ID and status are required");
}

$allowed_statuses = ['submitted', 'washing', 'drying', 'ready', 'delivered'];
if (!in_array($status, $allowed_statuses)) {
    sendResponse(400, "Invalid status value");
}

try {
    // Check if order exists
    $stmt = $pdo->prepare("SELECT id FROM laundry_orders WHERE id = ?");
    $stmt->execute([$order_id]);
    if (!$stmt->fetch()) {
        sendResponse(404, "Order not found");
    }

    // Update order status
    // If worker_id is provided, it also assigns the worker
    if ($worker_id) {
        $stmt = $pdo->prepare("UPDATE laundry_orders SET status = ?, worker_id = ? WHERE id = ?");
        $stmt->execute([$status, $worker_id, $order_id]);
    } else {
        $stmt = $pdo->prepare("UPDATE laundry_orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $order_id]);
    }

    // Also update all individual clothes in this order to the same status
    $stmt = $pdo->prepare("UPDATE clothes SET status = ? WHERE order_id = ?");
    $stmt->execute([$status, $order_id]);

    sendResponse(200, "Order status updated to: " . $status);

} catch (PDOException $e) {
    sendResponse(500, "Database error: " . $e->getMessage());
}
?>
