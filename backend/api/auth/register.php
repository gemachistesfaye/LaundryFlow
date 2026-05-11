<?php
/**
 * User Registration API
 */

require_once '../../config/database.php';
require_once '../../helpers/response.php';

// Allow CORS (Adjust for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, "Method Not Allowed");
}

$input = json_decode(file_get_contents("php://input"), true);

$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$password = $input['password'] ?? null;
$role = $input['role'] ?? 'student'; // Default to student
$phone = $input['phone'] ?? '';

if (!$name || !$email || !$password) {
    sendResponse(400, "Name, email, and password are required");
}

try {
    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(409, "Email already registered");
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword, $role, $phone]);

    $userId = $pdo->lastInsertId();

    sendResponse(201, "User registered successfully", [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
        'role' => $role
    ]);

} catch (PDOException $e) {
    sendResponse(500, "Database error: " . $e->getMessage());
}
?>
