<?php
/**
 * Helper function to send consistent JSON responses
 */

function sendResponse($status, $message, $data = null) {
    header('Content-Type: application/json');
    http_response_code($status);
    
    $response = [
        'success' => $status >= 200 && $status < 300,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}
?>
