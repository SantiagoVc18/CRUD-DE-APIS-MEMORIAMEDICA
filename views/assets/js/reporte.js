  function showSuccessMessage() {
            Swal.fire({
                title: '¡Éxito!',
                text: 'El reporte se ha registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "historialmedico.html";
                }
            });
        }

        function cargarDatosReporte() {
            const urlParams = new URLSearchParams(window.location.search);
            const paciente = urlParams.get('paciente');
            const medico = urlParams.get('medico');

            if (paciente) {
                document.getElementById('nombre').value = paciente;
                document.getElementById('nombre').readOnly = true;
            }
            if (medico) {
                document.getElementById('nombre_medico').value = medico;
                document.getElementById('nombre_medico').readOnly = true;
            }
        }

        function imprimirReporte() {
            window.print();
        }


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
            } else {
                cargarDatosReporte();
            }
        });

        // Función para cargar medicamentos
        async function cargarMedicamentos() {
            try {
                const response = await fetch('/api/medicamentos/obtener-todos');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const medicamentos = await response.json();
                
                const selects = document.querySelectorAll('.medicamento-select');
                selects.forEach(select => {
                    // Limpiar opciones existentes excepto la primera
                    while (select.options.length > 1) {
                        select.remove(1);
                    }
                    
                    // Agregar medicamentos
                    medicamentos.forEach(med => {
                        const option = document.createElement('option');
                        option.value = med.id;
                        option.textContent = `${med.nombre} (Disponible: ${med.cantidad_disponible})`;
                        select.appendChild(option);
                    });
                });
            } catch (error) {
                console.error('Error al cargar medicamentos:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los medicamentos. Por favor, intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        }

        // Función para verificar disponibilidad

        // Función para agregar nuevo campo de medicamento
        function agregarMedicamento() {
            const container = document.querySelector('.medicamentos-container');
            const template = document.querySelector('.medicamento-item').cloneNode(true);
            
            // Limpiar valores
            template.querySelector('.medicamento-select').value = '';
            template.querySelector('.cantidad-input').value = '';
            template.querySelector('.remove-medicamento').style.display = 'block';
            
            container.appendChild(template);
            cargarMedicamentos(); // Recargar opciones en el nuevo select
        }

        // Función para remover medicamento
        function removerMedicamento(button) {
            const container = document.querySelector('.medicamentos-container');
            if (container.children.length > 1) {
                button.closest('.medicamento-item').remove();
            }
        }


        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            // ... existing code ...
            
            // Cargar medicamentos al iniciar
            cargarMedicamentos();
            
            // Agregar evento para nuevo medicamento
            document.getElementById('agregar-medicamento').addEventListener('click', agregarMedicamento);
            
            // Agregar evento para remover medicamento
            document.querySelector('.medicamentos-container').addEventListener('click', (e) => {
                if (e.target.closest('.remove-medicamento')) {
                    removerMedicamento(e.target);
                }
            });
            
        });

        // Función para guardar el reporte
        async function guardarReporte(event) {
            event.preventDefault();
            
            try {
                // Obtener todos los medicamentos seleccionados
                const medicamentosItems = document.querySelectorAll('.medicamento-item');
                const medicamentos = Array.from(medicamentosItems).map(item => ({
                    id: item.querySelector('.medicamento-select').value,
                    cantidad: parseInt(item.querySelector('.cantidad-input').value) || 0
                }));

                // Validar que todos los medicamentos tengan cantidad válida
                const medicamentosInvalidos = medicamentos.filter(m => m.cantidad <= 0);
                if (medicamentosInvalidos.length > 0) {
                    throw new Error('Por favor, ingrese una cantidad válida para todos los medicamentos');
                }

                // Crear objeto con los datos del formulario
                const formData = {
                    nombre_paciente: document.getElementById('nombre').value,
                    nombre_medico: document.getElementById('nombre_medico').value,
                    edad: parseInt(document.getElementById('edad').value) || 0,
                    identificacion: document.getElementById('identificacion').value,
                    problemas: document.getElementById('telefono').value,
                    tratamiento: document.getElementById('Tratamiento').value,
                    detalles: document.getElementById('Detalles').value,
                    graveda_paciente: document.getElementById('Gravedad').value,
                    medicamentos: medicamentos.map(m => m.id).join(','),
                    cantidad_medicamento: medicamentos[0].cantidad // Tomamos la cantidad del primer medicamento
                };

                // Realizar la petición POST
                const response = await fetch('/api/empleado/guardar-reporte', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    showSuccessMessage();
                } else {
                    throw new Error(data.message || 'Error al guardar el reporte');
                }

            } catch (error) {
                console.error('Error al guardar el reporte:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo guardar el reporte. Por favor, intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        }

        // Agregar el event listener al formulario
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.querySelector('.reporte-form');
            if (form) {
                form.addEventListener('submit', guardarReporte);
            }
            
            // ... resto del código existente ...
        });