<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    $id = $data['id'];
    $sql = "DELETE FROM productos WHERE id='$id'";

    if ($conexion->query($sql)) {
        echo json_encode(["status" => "ok", "mensaje" => "Producto eliminado permanentemente"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al eliminar en base de datos"]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "ID no proporcionado"]);
}
?>