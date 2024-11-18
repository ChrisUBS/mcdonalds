<?php
include 'backend/connection.php';
// session_start();

// // Verificamos si hay una sesión activa del usuario
// if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
//     // Si no hay una sesión activa, redirigimos inmediatamente a la página de login
//     header('Location: /');
//     exit;
// }

// // Obtenemos el usuario de la sesión activa
// $user = $_SESSION['usuario'];

// // Consulta SQL para obtener los casos clínicos
// $sql = "SELECT id, nombre, clave, descripcion, visibilidad FROM casos";
// $result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>McDonald's</title>
    <link rel="icon" type="image/png" href="images/Mc-burger-icon.png">
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
	<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet"/>
	<link href="css/index-style.css" rel="stylesheet"/>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="/">
                <img src="images/McDonalds-logo.png" alt="McDonald's Logo" class="brand-logo"/>
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
				aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse justify-content-center" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="/">Inicio</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="nosotros">Acerca de nosotros</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="creditos">Créditos</a>
					</li>
				</ul>
			</div>
			<a href="#" class="btn btn-primary btn-add-order d-flex align-items-center">
                <i class="bi bi-plus-circle-fill me-2"></i> Agregar orden
			</a>
		</div>
	</nav>

    <!-- Main -->
    <main>
        <!-- <h1>Bienvenido a McDonald's!</h1> -->
    </main>

    <!-- Footer -->
	<footer class="footer mt-auto py-3">
		<div class="container text-center">
			<span class="text-muted">McDonald's © 2024</span>
		</div>
	</footer>

    <!-- Scripts -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>