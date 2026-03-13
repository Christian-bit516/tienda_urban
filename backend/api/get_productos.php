<?php
include_once '../config/db.php';

$sql = "SELECT * FROM productos";
$resultado = $conexion->query($sql);

$productos = [];
while ($fila = $resultado->fetch_assoc()) {
    $productos[] = $fila;
}

echo json_encode($productos);
?>