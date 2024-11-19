document.addEventListener('DOMContentLoaded', function () {
    // Mostrar el modal al hacer clic en el botón
    const addOrderButton = document.getElementById('btn-add-order');
    addOrderButton.addEventListener('click', function () {
        showAddOrderModal();
    });
});

// Funcion para mostrar el modal para agregar una nueva orden
function showAddOrderModal() {
    // Insertar el modal en el DOM
    const modal = new bootstrap.Modal(document.getElementById('addOrderModal'));
    modal.show();
    getProductsAndWaiters();

    const navigationButton = document.getElementById('navigationButton');
    const tabs = document.querySelectorAll('#addOrderTabs .nav-link');
    let currentTab = 0; // Índice inicial de la pestaña actual

    // Mostrar la pestaña actual
    function showTab(index) {
        tabs.forEach((tab, i) => {
            const targetPane = document.getElementById(tab.getAttribute('data-bs-target').substring(1));
            if (i === index) {
                tab.classList.add('active');
                targetPane.classList.add('show', 'active');
            } else {
                tab.classList.remove('active');
                targetPane.classList.remove('show', 'active');
            }
        });

        // Cambiar el texto del botón en función de la pestaña
        if (index === tabs.length - 1) {
            navigationButton.textContent = 'Guardar Orden';
            navigationButton.classList.add('btn-success');
            navigationButton.classList.remove('btn-primary');
        } else {
            navigationButton.textContent = 'Siguiente';
            navigationButton.classList.add('btn-primary');
            navigationButton.classList.remove('btn-success');
        }
    }

    // Manejar clic en el botón de navegación
    navigationButton.addEventListener('click', function () {
        if (currentTab < tabs.length - 1) {
            // Ir a la siguiente pestaña
            currentTab++;
            showTab(currentTab);
        } else {
            // En la última pestaña, guardar la orden
            saveOrder();
        }
    });

    // Cambiar de pestaña si el usuario hace clic en las pestañas manualmente
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            currentTab = index; // Actualizar la pestaña actual
            showTab(currentTab);
        });
    });

    // Inicializar mostrando la primera pestaña
    showTab(currentTab);

    // Función para guardar la orden (placeholder)
    function saveOrder() {
        alert('La orden ha sido guardada.'); // Aquí implementarás la lógica real para guardar la orden
        const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
        modal.hide(); // Cerrar el modal después de guardar
    }
}

// Función para extraer el menu de productos y los meseros
function getProductsAndWaiters() {
    fetch(`../backend/get-menu-meseros.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Llenar el combo box de meseros
                const waiterSelect = document.getElementById('mesero');
                waiterSelect.innerHTML = ''; // Limpiar opciones previas

                data.meseros.forEach(waiter => {
                    const option = document.createElement('option');
                    option.value = waiter.id;
                    option.textContent = `${waiter.nombre} ${waiter.apellido}`;
                    waiterSelect.appendChild(option);
                });

                // Llenar el contenedor de productos del menú
                const menuContainer = document.getElementById('menuContainer');
                menuContainer.innerHTML = ''; // Limpiar contenido previo

                data.menu.forEach(product => {
                    const productRow = document.createElement('div');
                    productRow.classList.add('form-group', 'mb-3');

                    productRow.innerHTML = `
                        <label>${product.nombre_producto}</label>
                        <div class="d-flex align-items-center">
                            <input type="number" class="form-control quantity-input me-2"
                                   data-price="${product.precio}" 
                                   placeholder="Cantidad" 
                                   min="0" 
                                   style="width: 80px;">
                            <span class="text-muted">$${product.precio}</span>
                        </div>
                    `;

                    menuContainer.appendChild(productRow);
                });
            } else {
                console.error('Error al cargar los productos y meseros:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}
