<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$precio = $_POST['precio'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$genero = $_POST['genero'] ?? '';
$tallas = $_POST['tallas'] ?? '';
$rutaImagen = $_POST['imagen_actual'] ?? ''; // Mantiene la foto vieja si no subes una nueva

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $fileName = time() . '_' . basename($_FILES["imagen"]["name"]);
    $targetFilePath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetFilePath)) {
        $rutaImagen = 'http://localhost/tienda_urban/backend/uploads/' . $fileName;
    }
}

if (!empty($id) && !empty($nombre) && !empty($precio)) {
    $sql = "UPDATE productos SET nombre='$nombre', precio='$precio', imagen='$rutaImagen', categoria='$categoria', genero='$genero', tallas='$tallas' WHERE id='$id'";

    if ($conexion->query($sql)) {
        echo json_encode(["status" => "ok", "mensaje" => "Producto actualizado"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al actualizar"]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos"]);
}
?>