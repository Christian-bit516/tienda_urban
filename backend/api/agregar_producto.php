<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['nombre']) && !empty($data['precio'])) {
    $nombre = $data['nombre'];
    $precio = $data['precio'];
    $imagen = $data['imagen'];
    $categoria = $data['categoria'];

    $sql = "INSERT INTO productos (nombre, precio, imagen, categoria) VALUES ('$nombre', '$precio', '$imagen', '$categoria')";

    if ($conexion->query($sql)) {
        echo json_encode(["status" => "ok", "mensaje" => "Producto agregado"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al insertar"]);
    }
}
?>