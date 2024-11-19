document.addEventListener('DOMContentLoaded', function () {
    // Cargar las ordenes
    loadOrders();
});

// Función para cargar las órdenes
function loadOrders() {
    fetch(`../backend/get-orders-info.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const ordersList = document.querySelector('.orders-list');
                ordersList.innerHTML = ''; // Limpiar la lista antes de renderizar

                // Iterar sobre las órdenes
                data.ordenes.forEach(order => {
                    // Crear una lista de productos
                    const productList = order.productos.map(product => product.nombre_producto).join(', ');
                    const productSummary = order.productos.length > 2
                        ? `${productList.split(', ').slice(0, 2).join(', ')} (y ${order.productos.length - 2} más)`
                        : productList;

                    // Formatear la fecha y hora
                    const fecha = new Date(order.fecha_tiempo);
                    const formattedDate = fecha.toLocaleDateString('es-ES');
                    const formattedTime = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                    // Crear la tarjeta de la orden
                    const orderCard = `
                        <div class="card case-card mb-3">
                            <div class="card-body">
                                <div class="d-flex card-title justify-content-between mb-3">
                                    <h5 style="font-size: 1.5rem; font-weight: 700; color: #343a40;">Orden #${order.orden_id}</h5>
                                    <h5 style="font-size: 1.2rem; font-weight: 500; color: #343a40;">${formattedTime} | ${formattedDate}</h5>
                                </div>
                                <p class="card-text">
                                    <strong>Cliente: </strong> ${order.cliente.nombre} ${order.cliente.apellido}<br>
                                    <strong>Mesa: </strong>${order.mesa}<br>
                                    <strong>Productos: </strong>${productSummary}<br>
                                    <strong>Mesero: </strong>${order.mesero.nombre} ${order.mesero.apellido}<br>
                                    <strong>Total: </strong>$${order.precio_total}
                                </p>
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-warning edit-case-btn me-2" data-id="${order.orden_id}" title="Detalles" onclick="showOrderDetails(${JSON.stringify(order).replace(/"/g, '&quot;')})"><i class="bi bi-eye"></i></button>
                                    <button class="btn btn-danger delete-case-btn me-2" data-id="${order.orden_id}" title="Borrar" onclick="confirmDeactivate(${order.orden_id})"><i class="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    `;

                    // Agregar la tarjeta a la lista
                    ordersList.insertAdjacentHTML('beforeend', orderCard);
                });
            } else {
                console.error('Error al cargar las órdenes:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
    });
}
