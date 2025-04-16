<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost:4306';
$dbname = 'tarea4';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['task_id'])) {
        $id_tarea = $_GET['task_id'];
        $stmt = $pdo->prepare("SELECT * FROM comentario WHERE id_tarea = ?");
        $stmt->execute([$id_tarea]);
        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            "status" => "success",
            "comments" => $comentarios
        ]);
    } else {
        http_response_code(400);
    }
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id_tarea'], $data['texto'])) {
        $stmt = $pdo->prepare("INSERT INTO comentario (id_tarea, texto) VALUES (?, ?)");
        $stmt->execute([$data['id_tarea'], $data['texto']]);
        echo json_encode(["success" => "Comentario agregado"]);
    } else {
        http_response_code(400);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id_comentario'], $data['texto'])) {
        $stmt = $pdo->prepare("UPDATE comentario SET texto = ? WHERE id_comentario = ?");
        $stmt->execute([$data['texto'], $data['id_comentario']]);
        echo json_encode(["success" => "Comentario actualizado"]);
    } else {
        http_response_code(400);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    if (isset($data['id_comentario'])) {
        $stmt = $pdo->prepare("DELETE FROM comentario WHERE id_comentario = ?");
        $stmt->execute([$data['id_comentario']]);
        echo json_encode(["success" => "Comentario eliminado"]);
    } else {
        http_response_code(400);
    }
    exit;
}

http_response_code(405);