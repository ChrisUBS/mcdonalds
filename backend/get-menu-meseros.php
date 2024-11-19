<?php
// Conexión a la base de datos
include 'connection.php';

$response = [];

// Consultar la tabla de "meseros" y "menu" para obtener la información de los meseros y los productos del menú
$sqlMeseros = "SELECT id, nombre, apellido FROM meseros;";
$sqlMenu = "SELECT id, nombre_producto, descripcion, precio FROM menu;";

$resultMeseros = $conn->query($sqlMeseros);
$resultMenu = $conn->query($sqlMenu);

if ($resultMeseros->num_rows > 0) {
    while ($row = $resultMeseros->fetch_assoc()) {
        $response['meseros'][] = [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'apellido' => $row['apellido'],
        ];
    }
}

if ($resultMenu->num_rows > 0) {
    while ($row = $resultMenu->fetch_assoc()) {
        $response['menu'][] = [
            'id' => $row['id'],
            'nombre_producto' => $row['nombre_producto'],
            'descripcion' => $row['descripcion'],
            'precio' => $row['precio'],
        ];
    }
}

// Enviar datos como JSON sin `print_r`
$response['success'] = true;
echo json_encode($response);

// Cerrar la conexión con la base de datos
$conn->close();
?>