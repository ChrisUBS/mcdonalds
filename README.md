# Gestión de Órdenes de McDonald's

## Descripción
Este proyecto es una aplicación de gestión de órdenes diseñada para un restaurante McDonald's. Permite a los empleados agregar, consultar y desactivar órdenes fácilmente mediante una interfaz intuitiva. También incluye funcionalidades para registrar clientes, seleccionar meseros y gestionar productos del menú de manera dinámica.

## Tecnologías utilizadas
- **Frontend**:
  - HTML
  - CSS
  - JavaScript
  - Bootstrap
- **Backend**:
  - PHP
  - MySQL

## Requisitos previos
Para ejecutar este proyecto, es necesario contar con:
- **XAMPP** (o cualquier servidor local que soporte PHP y MySQL)
- Un navegador web actualizado.

## Instrucciones de instalación
1. **Clonar el repositorio (si aplica)**:
   ```bash
   git clone https://github.com/ChrisUBS/mcdonalds
   ```
2. **Colocar los archivos del proyecto**:
   - Coloca los archivos del proyecto en la carpeta `htdocs` dentro del directorio de instalación de XAMPP.

3. **Configurar la base de datos**:
   - Importa el archivo `db/mcdonalds.sql` en `phpMyAdmin`.
   - Esto creará las tablas necesarias para la aplicación: `ordenes`, `clientes`, `productos_vendidos`, `menu`, `meseros`.
   - Importante modificar el archivo `backend/connection.php` para poner las credenciales de acceso a la base de datos.

4. **Configurar el servidor**:
   - Asegúrate de que XAMPP esté corriendo con los servicios de **Apache** y **MySQL** activados.

5. **Abrir el proyecto**:
   - Accede a la aplicación desde tu navegador en: `http://localhost/>`.

## Uso del proyecto
- **Agregar órdenes**:
  - Presiona el botón de "Agregar Órdenes" para registrar una nueva orden.
  - Completa los datos del cliente, selecciona el mesero y elige los productos del menú.
  - Guarda la orden para registrarla en el sistema.

- **Consultar órdenes**:
  - Presiona el botón con el ícono de "ojito" para ver los detalles completos de una orden, como cliente, mesero y productos seleccionados.

- **Desactivar órdenes**:
  - Presiona el botón con el ícono de "basurero" para desactivar una orden. La orden permanecerá en la base de datos con su estado desactivado.

## Base de datos
- **Tablas principales**:
  - `ordenes`: Registra información de las órdenes (mesa, mesero, cliente, productos).
  - `clientes`: Almacena los datos de los clientes registrados.
  - `productos_vendidos`: Relaciona productos seleccionados con órdenes específicas.
  - `menu`: Contiene información de los productos disponibles (nombre, descripción, precio).
  - `meseros`: Almacena información de los meseros disponibles.

- **Relaciones importantes**:
  - Una orden está relacionada con un cliente, un mesero y uno o más productos vendidos.

## Créditos
- **Christian Bonilla**  
  - Correo: [christian.bonilla@uabc.edu.mx](mailto:christian.bonilla@uabc.edu.mx)

## Licencia
Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPL-3.0)**. Para más detalles, consulta el archivo `LICENSE` o visita [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).
