<?php
/**
 * Payments & Wallet API
 */

require_once '../../config/database.php';
require_once '../../helpers/response.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Process Payment / Wallet Deposit
    $input = json_decode(file_get_contents("php://input"), true);
    
    $user_id = $input['user_id'] ?? null;
    $amount = $input['amount'] ?? 0;
    $order_id = $input['order_id'] ?? null; // Null for wallet deposit
    $payment_method = $input['method'] ?? 'cash';
    
    if (!$user_id || $amount <= 0) {
        sendResponse(400, "User ID and valid amount are required");
    }

    try {
        $pdo->beginTransaction();

        // 1. Record the payment
        $stmt = $pdo->prepare("INSERT INTO payments (user_id, order_id, amount, method, status) VALUES (?, ?, ?, ?, 'pending')");
        $stmt->execute([$user_id, $order_id, $amount, $payment_method]);
        $payment_id = $pdo->lastInsertId();

        // 2. If it's a wallet deposit, we might wait for admin confirmation
        // But for this flow, let's assume it's logged and pending.

        $pdo->commit();
        sendResponse(201, "Payment request submitted. Awaiting confirmation.", ['payment_id' => $payment_id]);

    } catch (Exception $e) {
        $pdo->rollBack();
        sendResponse(500, "Error processing payment: " . $e->getMessage());
    }

} elseif ($method === 'GET') {
    // Get Payment History
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) sendResponse(400, "User ID required");

    try {
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        $history = $stmt->fetchAll();
        sendResponse(200, "Payment history retrieved", $history);
    } catch (PDOException $e) {
        sendResponse(500, "Database error");
    }
}
?>
