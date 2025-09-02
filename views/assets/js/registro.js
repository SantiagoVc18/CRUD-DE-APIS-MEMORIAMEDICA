   // Verificar si el usuario está autenticados y que carga el formularios
      window.addEventListener('DOMContentLoaded', () => {
          const usuario = localStorage.getItem('usuarioNombre');
          if (!usuario) {
              Swal.fire({
                  title: 'Acceso denegado',
                  text: 'Debes iniciar sesión para acceder a esta página',
                  icon: 'warning',
                  confirmButtonText: 'Ir al login'
              }).then((result) => {
                  if (result.isConfirmed) {
                      window.location.href = "login.html";
                  }
              });
          }

          // Validación del formulario
          const form = document.getElementById('registroForm');
          form.addEventListener('submit', async (e) => {
              e.preventDefault();

              try {
                  // Recolectar datos directamente de los elementos del formulario
                  const data = {
                      nombre: form.querySelector('[name="nombre"]').value.trim(),
                      apellido: form.querySelector('[name="apellido"]').value.trim(),
                      edad: parseInt(form.querySelector('[name="edad"]').value),
                      telefono: form.querySelector('[name="telefono"]').value.trim(),
                      identificacion: form.querySelector('[name="identificacion"]').value.trim(),
                      genero: form.querySelector('[name="genero"]').value,
                      fecha_nacimiento: form.querySelector('[name="fecha_nacimiento"]').value,
                      estado_civil: form.querySelector('[name="estado_civil"]').value,
                      direccion: form.querySelector('[name="direccion"]').value.trim(),
                      tipo_usuario: form.querySelector('[name="tipo_usuario"]').value
                  };

                  // Validar que ningún campo sea undefined o vacío
                  const camposVacios = [];
                  for (const [key, value] of Object.entries(data)) {
                      if (value === undefined || value === null || value === '') {
                          camposVacios.push(key);
                      }
                  }

                  if (camposVacios.length > 0) {
                      throw new Error(`Los siguientes campos son requeridos: ${camposVacios.join(', ')}`);
                  }

                  console.log('📤 Datos a enviar:', data);

                  const response = await fetch('/api/empleado/registrar-paciente', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json'
                      },
                      body: JSON.stringify(data)
                  });

                  const result = await response.json();
                  console.log('📥 Respuesta del servidor:', result);

                  if (!response.ok) {
                      throw new Error(result.error || 'Error al registrar');
                  }

                  Swal.fire({
                      title: '¡Éxito!',
                      text: result.message || 'El registro se ha completado correctamente',
                      icon: 'success',
                      confirmButtonText: 'Aceptar'
                  }).then((result) => {
                      if (result.isConfirmed) {
                          window.location.href = "index.html";
                      }
                  });
              } catch (error) {
                  console.error('Error:', error);
                  Swal.fire({
                      title: 'Error',
                      text: error.message || 'Ha ocurrido un error al registrar. Por favor, intente nuevamente.',
                      icon: 'error',
                      confirmButtonText: 'Entendido'
                  });
              }
          });
      });