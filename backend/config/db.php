<?php
// Configuración de la base de datos
$host = "localhost";
$user = "root";
$pass = "";
$db   = "tienda_urbana";

$conexion = new mysqli($host, $user, $pass, $db);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexion->connect_error]));
}

// Configuración de Cabeceras para que React pueda conectarse
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=UTF-8");
?>