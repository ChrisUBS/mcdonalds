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

// Función para mostrar el modal con los detalles de una orden
function showOrderDetails(order) {
    // Llenar pestaña "General"
    document.getElementById('modal-order-id').textContent = order.orden_id;
    document.getElementById('modal-order-date').textContent = new Date(order.fecha_tiempo).toLocaleString('es-ES');
    document.getElementById('modal-order-table').textContent = order.mesa;
    document.getElementById('modal-order-total').textContent = order.precio_total;
    document.getElementById('modal-order-payment-method').textContent = order.metodo_pago;

    // Llenar pestaña "Productos"
    const productsList = document.getElementById('modal-order-products');
    productsList.innerHTML = ''; // Limpiar lista de productos
    order.productos.forEach(product => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${product.cantidad}x ${product.nombre_producto} - $${product.precio}`;
        productsList.appendChild(listItem);
    });

    // Llenar pestaña "Cliente"
    document.getElementById('modal-client-name').textContent = order.cliente.nombre;
    document.getElementById('modal-client-lastname').textContent = order.cliente.apellido;
    document.getElementById('modal-client-phone').textContent = order.cliente.celular;

    // Llenar pestaña "Mesero"
    document.getElementById('modal-mesero-name').textContent = order.mesero.nombre;
    document.getElementById('modal-mesero-lastname').textContent = order.mesero.apellido;
    document.getElementById('modal-mesero-phone').textContent = order.mesero.celular;
    document.getElementById('modal-mesero-gender').textContent = order.mesero.genero;

    // Siempre activar la primera pestaña ("General")
    const generalTab = document.getElementById('general-tab');
    const tabs = new bootstrap.Tab(generalTab);
    tabs.show();

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

// Funcionalidad para desactivar una orden

let orderToDeactivate = null; // Variable para almacenar el ID de la orden a desactivar

// Función para mostrar el modal de confirmación
function confirmDeactivate(orderId) {
    orderToDeactivate = orderId; // Almacenar el ID de la orden
    const modal = new bootstrap.Modal(document.getElementById('confirmDeactivateModal'));
    modal.show(); // Mostrar el modal
}

// Manejar la confirmación del modal
document.getElementById('confirmDeactivateButton').addEventListener('click', function () {
    if (orderToDeactivate !== null) {
        markOrderInactive(orderToDeactivate);
        orderToDeactivate = null; // Restablecer la variable
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeactivateModal'));
        modal.hide(); // Cerrar el modal
    }
});

// Función para desactivar la orden (misma que antes)
function markOrderInactive(orderId) {
    fetch('../backend/update-order-status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${orderId}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // alert('Orden desactivada correctamente.');
                loadOrders(); // Vuelve a cargar las órdenes activas
            } else {
                alert(`Error al desactivar la orden: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error al desactivar la orden:', error);
            alert('Ocurrió un error al intentar desactivar la orden. Por favor, inténtalo de nuevo.');
        });
}
