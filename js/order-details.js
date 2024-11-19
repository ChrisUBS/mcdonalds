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
