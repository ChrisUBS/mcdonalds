<?php
// Conexión a la base de datos
include 'connection.php';

// Verificar que se recibió un ID válido
if (!isset($_POST['id']) || !filter_var($_POST['id'], FILTER_VALIDATE_INT)) {
    echo json_encode(['success' => false, 'message' => 'ID de la orden inválido o no proporcionado.']);
    exit;
}

$id = intval($_POST['id']);

// Cambiar el estado de la orden a 0
$sql = "UPDATE ordenes SET estado = 0 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Orden marcada como inactiva correctamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado de la orden.']);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
