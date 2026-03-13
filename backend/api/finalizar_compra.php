<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['carrito'])) {
    // Convertimos el array de productos en un solo texto para la base de datos
    $nombres_productos = implode(", ", array_column($data['carrito'], 'nombre'));
    $total = $data['total'];

    $sql = "INSERT INTO pedidos (productos, total) VALUES ('$nombres_productos', '$total')";

    if ($conexion->query($sql)) {
        echo json_encode(["status" => "ok", "mensaje" => "¡Compra registrada con éxito!"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al guardar"]);
    }
}
?>