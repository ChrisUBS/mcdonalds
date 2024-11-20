<?php
// Conexión a la base de datos
include 'connection.php';
header('Content-Type: application/json');

// Obtener los datos enviados desde el cliente
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos no válidos']);
    exit;
}

$mesa = $data['mesa'];
$metodoPago = $data['metodo_pago'];
$idMesero = $data['id_mesero'];
$cliente = $data['cliente'];
$productos = $data['productos'];

$conn->begin_transaction();

try {
    // Insertar cliente
    $sqlCliente = "INSERT INTO clientes (nombre, apellido, celular) VALUES (?, ?, ?)";
    $stmtCliente = $conn->prepare($sqlCliente);
    $stmtCliente->bind_param('sss', $cliente['nombre'], $cliente['apellido'], $cliente['celular']);
    $stmtCliente->execute();
    $idCliente = $stmtCliente->insert_id;

    // Calcular precio total
    $precioTotal = 0;
    foreach ($productos as $producto) {
        $productId = $producto['id_menu'];
        $cantidad = $producto['cantidad'];

        $sqlPrecio = "SELECT precio FROM menu WHERE id = ?";
        $stmtPrecio = $conn->prepare($sqlPrecio);
        $stmtPrecio->bind_param('i', $productId);
        $stmtPrecio->execute();
        $resultPrecio = $stmtPrecio->get_result()->fetch_assoc();
        $precioTotal += $resultPrecio['precio'] * $cantidad;
    }

    // Insertar orden
    $sqlOrden = "INSERT INTO ordenes (fecha_tiempo, id_mesero, mesa, precio_total, metodo_pago, estado, id_cliente) 
                VALUES (NOW(), ?, ?, ?, ?, 1, ?)";
    $stmtOrden = $conn->prepare($sqlOrden);
    $stmtOrden->bind_param('iidsi', $idMesero, $mesa, $precioTotal, $metodoPago, $idCliente);
    $stmtOrden->execute();
    $idOrden = $stmtOrden->insert_id;

    // Insertar productos vendidos
    $sqlProductoVendido = "INSERT INTO productos_vendidos (id_menu, cantidad, id_orden) VALUES (?, ?, ?)";
    $stmtProducto = $conn->prepare($sqlProductoVendido);
    foreach ($productos as $producto) {
        $stmtProducto->bind_param('iii', $producto['id_menu'], $producto['cantidad'], $idOrden);
        $stmtProducto->execute();
    }

    // Confirmar transacción
    $conn->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error al guardar la orden: ' . $e->getMessage()]);
}

$conn->close();
?>
