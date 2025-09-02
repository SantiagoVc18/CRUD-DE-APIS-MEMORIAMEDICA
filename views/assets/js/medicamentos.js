document.addEventListener("DOMContentLoaded", () => {
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


    // Referencias a elementos del DOM
    const listaMedicamentos = document.getElementById("listaMedicamentos");
    const form = document.getElementById("registro-medicamento");
    const modal = new bootstrap.Modal(document.getElementById("modalMedicamento"));
    const modalTitulo = document.getElementById("modalTitulo");
    const medicamentoIdInput = document.getElementById("medicamentoId");
    const btnGuardar = document.getElementById("btnGuardar");

    // Referencias a campos del formulario
    const nombreInput = document.getElementById("nombre");
    const cantidadDisponibleInput = document.getElementById("cantidadDisponible");
    const cantidadMinimaInput = document.getElementById("cantidadMinima");
    const unidadMedidaInput = document.getElementById("unidadMedida");

    // Cargar medicamentos al iniciar
    cargarMedicamentos();

    // Función para cargar todos los medicamentos
    async function cargarMedicamentos() {
        try {
            const response = await fetch("/api/medicamentos/obtener-todos");
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const medicamentos = await response.json();

            listaMedicamentos.innerHTML = "";

            medicamentos.forEach(med => {
                const card = document.createElement("div");
                card.classList.add("col-md-4", "mb-3");

                card.innerHTML = `
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="card-title">${med.nombre}</h5>
                            <p class="card-text">
                                <strong>Disponible:</strong> ${med.cantidad_disponible}<br>
                                <strong>Mínima:</strong> ${med.cantidad_minima}<br>
                                <strong>Unidad:</strong> ${med.unidad_medida}
                            </p>
                            <button class="btn btn-sm btn-warning me-2" onclick="editarMedicamento(${med.id})">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarMedicamento(${med.id})">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                `;
                listaMedicamentos.appendChild(card);
            });
        } catch (error) {
            console.error("Error al cargar medicamentos:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los medicamentos',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        form.reset();
        medicamentoIdInput.value = "";
        modalTitulo.textContent = "Nuevo Medicamento";
        btnGuardar.textContent = "Guardar";
    }

    // Evento para el botón "Nuevo Medicamento"
    document.querySelector('[data-bs-target="#modalMedicamento"]').addEventListener('click', () => {
        limpiarFormulario();
        modal.show();
    });

    // Función para validar y preparar los datos
    function prepararDatos() {
        const nombre = nombreInput.value.trim();
        const cantidadDisponible = parseInt(cantidadDisponibleInput.value);
        const cantidadMinima = parseInt(cantidadMinimaInput.value);
        const unidadMedida = unidadMedidaInput.value.trim();

        // Validar que todos los campos tengan valores válidos
        if (!nombre) {
            throw new Error("El nombre es requerido");
        }
        if (isNaN(cantidadDisponible) || cantidadDisponible < 0) {
            throw new Error("La cantidad disponible debe ser un número positivo");
        }
        if (isNaN(cantidadMinima) || cantidadMinima < 0) {
            throw new Error("La cantidad mínima debe ser un número positivo");
        }
        if (!unidadMedida) {
            throw new Error("La unidad de medida es requerida");
        }

        return {
            nombre,
            cantidad_disponible: cantidadDisponible,
            cantidad_minima: cantidadMinima,
            unidad_medida: unidadMedida
        };
    }

    // Evento para el formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            // Preparar y validar datos
            const datos = prepararDatos();
            console.log('Datos a enviar:', datos);

            const id = medicamentoIdInput.value;
            const url = id 
                ? `/api/medicamentos/actualizar-medicamento/${id}`
                : '/api/medicamentos/guardar-medicamento';
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al guardar el medicamento");
            }

            Swal.fire({
                icon: "success",
                title: id ? "Medicamento actualizado" : "Medicamento registrado",
                showConfirmButton: false,
                timer: 1500
            });

            limpiarFormulario();
            modal.hide();
            cargarMedicamentos();

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Hubo un problema al guardar el medicamento",
                icon: "error",
                confirmButtonText: "Entendido"
            });
        }
    });

    // Función para editar medicamento
    window.editarMedicamento = async (id) => {
        try {
            const response = await fetch(`/api/medicamentos/obtener-medicamento/${id}`);
            if (!response.ok) {
                throw new Error("Error al obtener el medicamento");
            }
            const med = await response.json();

            // Llenar el formulario
            medicamentoIdInput.value = med.id;
            nombreInput.value = med.nombre;
            cantidadDisponibleInput.value = med.cantidad_disponible;
            cantidadMinimaInput.value = med.cantidad_minima;
            unidadMedidaInput.value = med.unidad_medida;

            // Actualizar UI
            modalTitulo.textContent = "Editar Medicamento";
            btnGuardar.textContent = "Actualizar";
            modal.show();

        } catch (error) {
            console.error("Error al obtener medicamento:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cargar el medicamento",
                icon: "error",
                confirmButtonText: "Entendido"
            });
        }
    };

    // Función para eliminar medicamento
    window.eliminarMedicamento = async (id) => {
        try {
            const result = await Swal.fire({
                title: "¿Eliminar medicamento?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                const response = await fetch(`/api/medicamentos/eliminar-medicamento/${id}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Error al eliminar el medicamento");
                }

                Swal.fire({
                    title: "Eliminado",
                    text: "Medicamento eliminado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                cargarMedicamentos();
            }
        } catch (error) {
            console.error("Error al eliminar medicamento:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el medicamento",
                icon: "error",
                confirmButtonText: "Entendido"
            });
        }
    };
});