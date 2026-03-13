<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$sql = "SELECT * FROM pedidos ORDER BY fecha DESC";
$resultado = $conexion->query($sql);

$pedidos = [];
// Corregido: num_rows es la propiedad correcta en PHP mysqli
if ($resultado && $resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $pedidos[] = $fila;
    }
}

echo json_encode($pedidos);
?>