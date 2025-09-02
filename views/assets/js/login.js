   // hacer que el formulario de inicio de sesión funcione
        document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            // Obtener los valores de usuario y contraseña
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            try {
                const response = await fetch('/empleado/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario: username, contrasena: password })
                });
        
                const data = await response.json();
        
                if (response.ok && data.success) {
                    localStorage.setItem('usuarioNombre', data.nombre);
                    Swal.fire({
                        title: "¡Inicio de sesión exitoso!",
                        icon: "success",
                        draggable: true
                    }).then(() => {
                        window.location.href = 'index.html';
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error de autenticación",
                        text: data.message || "Usuario o contraseña incorrectos",
                        footer: '<a href="#">¿No tienes una cuenta? Comunicarse al area de soporte</a>'
                    });
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor revisar el index o la ruta",
                    footer: '<a href="#">¿Por qué tengo este problema?</a>'
                });
            }
        });