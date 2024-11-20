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
}

// Función para extraer el menu de productos y los meseros
function getProductsAndWaiters() {
    fetch(`../backend/get-menu-meseros.php`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Llenar el combo box de meseros
                const waiterSelect = document.getElementById('add-mesero-select');
                waiterSelect.innerHTML = ''; // Limpiar opciones previas

                data.meseros.forEach(waiter => {
                    const option = document.createElement('option');
                    option.value = waiter.id;
                    option.textContent = `${waiter.nombre} ${waiter.apellido}`;
                    waiterSelect.appendChild(option);
                });

                // Llenar el contenedor
                populateMenu(data);
            } else {
                console.error('Error al cargar los productos y meseros:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}

// Llenar el contenedor de productos del menú
function populateMenu(data) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = ''; // Limpiar contenido previo

    data.menu.forEach(product => {
        const productRow = document.createElement('div');
        productRow.classList.add('row', 'align-items-center', 'mb-3');

        productRow.innerHTML = `
            <!-- Columna para el producto -->
            <div class="col-8">
                <div class="form-check">
                    <input class="form-check-input product-checkbox" type="checkbox" id="product-${product.id}" data-id="${product.id}" data-price="${parseFloat(product.precio)}">
                    <label class="form-check-label" for="product-${product.id}">
                        ${product.nombre_producto} - $${parseFloat(product.precio).toFixed(2)}
                    </label>
                </div>
            </div>

            <!-- Columna para cantidad y total -->
            <div class="col-4">
                <div class="quantity-container d-flex align-items-center">
                    <input type="number" class="form-control quantity-input me-2"
                           data-price="${parseFloat(product.precio)}"
                           placeholder="Cantidad"
                           min="1"
                           disabled
                           style="width: 60px;">
                    <span class="text-muted">Total: $<span class="product-total">0.00</span></span>
                </div>
            </div>
        `;

        menuContainer.appendChild(productRow);

        // Manejar cambios en el checkbox
        const checkbox = productRow.querySelector('.product-checkbox');
        const quantityInput = productRow.querySelector('.quantity-input');
        const productTotal = productRow.querySelector('.product-total');

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                quantityInput.disabled = false; // Habilitar la cantidad si está seleccionado
                quantityInput.focus(); // Opcional: enfocar el campo de cantidad
            } else {
                quantityInput.disabled = true; // Deshabilitar la cantidad si se deselecciona
                quantityInput.value = ''; // Resetear la cantidad
                productTotal.textContent = '0.00'; // Resetear el total
                updateSubtotal(); // Recalcular el subtotal
            }
        });

        // Calcular el total para este producto y actualizar el subtotal
        quantityInput.addEventListener('input', function () {
            if (!checkbox.checked) {
                quantityInput.value = ''; // No permitir cambios si el checkbox no está seleccionado
                return;
            }
            const quantity = parseInt(quantityInput.value) || 0;
            const price = parseFloat(quantityInput.getAttribute('data-price')) || 0;
            const total = quantity * price;
            productTotal.textContent = total.toFixed(2);
            updateSubtotal(); // Recalcular el subtotal
        });

        updateSubtotal(); // Actualizar el subtotal inicial
    });
}

// Función para actualizar el subtotal
function updateSubtotal() {
    const menuContainer = document.getElementById('menuContainer');
    const subtotalElement = document.getElementById('subtotal');
    let subtotal = 0;

    menuContainer.querySelectorAll('.quantity-input').forEach(input => {
        const quantity = parseInt(input.value) || 0;
        const price = parseFloat(input.getAttribute('data-price')) || 0;
        subtotal += quantity * price;
    });

    subtotalElement.textContent = subtotal.toFixed(2); // Actualizar el subtotal
}

// Función para guardar la orden
function saveOrder() {
    // Capturar datos del formulario
    const mesa = document.getElementById('mesa').value;
    const metodoPago = document.getElementById('metodo_pago').value;
    const clienteNombre = document.getElementById('nombre_cliente').value.trim();
    const clienteApellido = document.getElementById('apellido_cliente').value.trim();
    const clienteCelular = document.getElementById('celular_cliente').value.trim();
    const meseroId = document.getElementById('add-mesero-select').value;

    // Capturar productos seleccionados
    const menuContainer = document.getElementById('menuContainer');
    const selectedProducts = [];
    menuContainer.querySelectorAll('.product-checkbox:checked').forEach(productCheckbox => {
        const quantityInput = productCheckbox.closest('.row').querySelector('.quantity-input');
        const productId = productCheckbox.getAttribute('data-id');
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
            selectedProducts.push({
                id_menu: productId,
                cantidad: quantity,
            });
        }
    });

    // Validar que al menos haya un producto seleccionado
    if (selectedProducts.length === 0) {
        alert('Debe seleccionar al menos un producto.');
        return;
    }

    // Crear el objeto para enviar al servidor
    const orderData = {
        mesa,
        metodo_pago: metodoPago,
        cliente: {
            nombre: clienteNombre,
            apellido: clienteApellido,
            celular: clienteCelular,
        },
        id_mesero: meseroId,
        productos: selectedProducts,
    };

    // Enviar los datos al servidor
    fetch('../backend/save-order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                // alert('Orden guardada exitosamente.');
                const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
                modal.hide(); // Cerrar el modal
                location.reload(); // Refrescar la página (opcional)
            } else {
                alert(`Error al guardar la orden: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error al guardar la orden:', error);
            alert('Ocurrió un error al guardar la orden.');
        });
}
