<?php
// Conexión a la base de datos
include 'connection.php';

$response = [];

// Consultar la tabla de "ordenes" con información de clientes, meseros y productos vendidos
$sqlOrdenes = "
SELECT 
    o.id AS orden_id,
    o.fecha_tiempo,
    o.mesa,
    o.precio_total,
    o.metodo_pago,
    o.estado,
    c.nombre AS cliente_nombre,
    c.apellido AS cliente_apellido,
    c.celular AS cliente_celular,
    m.nombre AS mesero_nombre,
    m.apellido AS mesero_apellido,
    m.genero AS mesero_genero,
    m.celular AS mesero_celular,
    pv.cantidad,
    mn.nombre_producto,
    mn.descripcion AS producto_descripcion,
    mn.precio AS producto_precio
FROM ordenes o
LEFT JOIN clientes c ON o.id = c.id_orden
LEFT JOIN meseros m ON o.id_mesero = m.id
LEFT JOIN productos_vendidos pv ON o.id = pv.id_orden
LEFT JOIN menu mn ON pv.id_menu = mn.id
WHERE o.estado = 1
ORDER BY o.fecha_tiempo ASC;
";

$result = $conn->query($sqlOrdenes);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ordenId = $row['orden_id'];

        // Si no se ha agregado esta orden, la inicializamos
        if (!isset($response[$ordenId])) {
            $response[$ordenId] = [
                'orden_id' => $ordenId,
                'fecha_tiempo' => $row['fecha_tiempo'],
                'mesa' => $row['mesa'],
                'precio_total' => $row['precio_total'],
                'metodo_pago' => $row['metodo_pago'],
                'estado' => $row['estado'],
                'cliente' => [
                    'nombre' => $row['cliente_nombre'],
                    'apellido' => $row['cliente_apellido'],
                    'celular' => $row['cliente_celular'],
                ],
                'mesero' => [
                    'nombre' => $row['mesero_nombre'],
                    'apellido' => $row['mesero_apellido'],
                    'genero' => $row['mesero_genero'],
                    'celular' => $row['mesero_celular'],
                ],
                'productos' => []
            ];
        }

        // Agregamos los productos vendidos a la orden
        if ($row['nombre_producto']) {
            $response[$ordenId]['productos'][] = [
                'cantidad' => $row['cantidad'],
                'nombre_producto' => $row['nombre_producto'],
                'descripcion' => $row['producto_descripcion'],
                'precio' => $row['producto_precio'],
            ];
        }
    }
}

// Convertimos el resultado en un arreglo plano
$response = array_values($response);

// Enviar los datos como JSON
echo json_encode([
    'success' => true,
    'ordenes' => $response
]);

// Cerrar la conexión
$conn->close();
?>