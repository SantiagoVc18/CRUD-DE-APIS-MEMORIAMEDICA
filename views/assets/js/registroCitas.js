// Verificar si el usuario ha iniciado sesión y cargar el formulario
window.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuarioNombre');
    if (!usuario) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "login.html";
    }

    // Validación del formulario
    const form = document.getElementById('citaForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar campos vacíos
        const campos = form.querySelectorAll('input, select, textarea');
        let camposVacios = [];
        
        campos.forEach(campo => {
            if (!campo.value.trim()) {
                camposVacios.push(campo.previousElementSibling.textContent.trim());
            }
        });

        if (camposVacios.length > 0) {
            Swal.fire({
                title: 'Error',
                html: `Por favor complete los siguientes campos:<br>${camposVacios.join('<br>')}`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        try {
            // Obtener los valores del formulario
            const formData = new FormData(form);
            const data = {
                nombre_paciente: formData.get('nombre_paciente').trim(),
                nombre_medico: formData.get('nombre_medico').trim(),
                fecha: formData.get('fecha'),
                hora: formData.get('hora'),
                motivo: formData.get('motivo').trim(),
                tipo_consulta: formData.get('tipo_consulta')
            };

            // Validar que ningún campo sea undefined o vacío
            for (const [key, value] of Object.entries(data)) {
                if (!value) {
                    throw new Error(`El campo ${key} no puede estar vacío`);
                }
            }

            // Validar formato de fecha y hora
            const fechaCita = new Date(data.fecha + 'T' + data.hora);
            const ahora = new Date();
            
            if (fechaCita < ahora) {
                throw new Error('La fecha y hora de la cita no pueden ser anteriores a la fecha actual');
            }

            const response = await fetch('/api/empleado/registrar-cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al registrar la cita');
            }

            const result = await response.text();
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'La cita se ha registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "historialmedico.html";
                }
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Ha ocurrido un error al registrar la cita. Por favor, intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    });
});