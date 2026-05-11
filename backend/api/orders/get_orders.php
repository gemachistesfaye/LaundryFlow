<?php
/**
 * Get Orders API (Role-Based)
 */

require_once '../../config/database.php';
require_once '../../helpers/response.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(405, "Method Not Allowed");
}

$user_id = $_GET['user_id'] ?? null;
$role = $_GET['role'] ?? 'student';

if (!$user_id) {
    sendResponse(400, "User ID is required");
}

try {
    $sql = "SELECT o.*, u.name as student_name 
            FROM laundry_orders o 
            JOIN users u ON o.student_id = u.id";
    $params = [];

    if ($role === 'student') {
        $sql .= " WHERE o.student_id = ?";
        $params = [$user_id];
    } elseif ($role === 'worker') {
        $sql .= " WHERE o.worker_id = ? OR o.worker_id IS NULL";
        $params = [$user_id];
    } elseif ($role === 'admin') {
        // No filter for admin
    } else {
        sendResponse(403, "Unauthorized role");
    }

    $sql .= " ORDER BY o.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    sendResponse(200, "Orders retrieved successfully", $orders);

} catch (PDOException $e) {
    sendResponse(500, "Database error: " . $e->getMessage());
}
?>
