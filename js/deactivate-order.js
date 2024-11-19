// Función para mostrar el modal de confirmación
function confirmDeactivate(orderId) {
    orderToDeactivate = orderId; // Almacenar el ID de la orden
    const modal = new bootstrap.Modal(document.getElementById('confirmDeactivateModal'));
    // const modal = new bootstrap.Modal(confirmDeactivateModalHTML);
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