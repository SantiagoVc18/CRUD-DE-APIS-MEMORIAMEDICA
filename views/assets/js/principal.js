 window.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticados
    const nombre = localStorage.getItem('usuarioNombre');
    const navbar = document.querySelector('.navbar-nav');
    const loginItem = document.getElementById('loginLink');

    // Si el usuario está autenticado, ocultar el enlace de inicio de sesión y mostrar el nombre del usuario
    if (nombre) {
      loginItem.remove();

      // Crear un nuevo elemento de lista para el nombre del usuario
      const userItem = document.createElement('li');
      userItem.className = 'nav-item';
      userItem.innerHTML = `<span class="nav-link text-success">👤 ${nombre}</span>`;
      navbar.appendChild(userItem);

      // Crear un nuevo elemento de lista para el enlace de cerrar sesión
      const logoutItem = document.createElement('li');
      logoutItem.className = 'nav-item';
      logoutItem.innerHTML = `<a class="nav-link text-danger" href="#" id="cerrarSesion">Cerrar sesión</a>`;
      navbar.appendChild(logoutItem);

      // Agregar evento de clic para cerrar sesión
      document.getElementById('cerrarSesion').addEventListener('click', () => {
        localStorage.removeItem('usuarioNombre');
        window.location.href = "login.html";
      });

      // Mostrar el menú de usuario
      const menuUsuario = document.getElementById('menuUsuario');
      if (menuUsuario) {
        menuUsuario.style.display = 'inline-block';
      }
    }
  });