<?php
include_once '../config/db.php';

$mensaje = array("estado" => "ok", "mensaje" => "Conexión exitosa con el backend de Tienda Urban");
echo json_encode($mensaje);
?>