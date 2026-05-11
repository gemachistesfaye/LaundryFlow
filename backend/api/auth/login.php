<?php
/**
 * User Login API
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

$email = $input['email'] ?? null;
$password = $input['password'] ?? null;

if (!$email || !$password) {
    sendResponse(400, "Email and password are required");
}

try {
    // Find user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        sendResponse(401, "Invalid email or password");
    }

    // Success - In a real app, you would generate a JWT here.
    // For this demonstration, we'll return user info.
    // Ensure sensitive data like password hash is not returned.
    unset($user['password']);

    sendResponse(200, "Login successful", [
        'user' => $user,
        'token' => 'dummy-jwt-token-' . bin2hex(random_bytes(16)) // Placeholder for real JWT
    ]);

} catch (PDOException $e) {
    sendResponse(500, "Database error: " . $e->getMessage());
}
?>
