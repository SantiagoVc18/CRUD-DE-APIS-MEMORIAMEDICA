 
    // CARGAR HISTORIAL MÉDICO
    function renderTabla(historialData) {
      const tbody = document.querySelector('#tablaHistorialMedico tbody');
      tbody.innerHTML = '';

      // Iteramos sobre los datos del historial médico y creamos las filas
      historialData.forEach(item => {
        const fila = document.createElement('tr');

        const celdas = [
          item.ID,
          item.NOMBRE_PACIENTE,
          item.NOMBRE_MEDICO,
          item.EDAD,
          item.PROBLEMAS,
          item.IDENTIFICACION,
          item.TRATAMIENTO,
          item.DETALLES,
          item.MEDICAMENTOS,
          item.GRAVEDA_PACIENTE
        ];

        celdas.forEach(texto => {
          const celda = document.createElement('td');
          celda.textContent = texto;
          fila.appendChild(celda);
        });

        const celdaAccion = document.createElement('td');
        const btnAccion = document.createElement('button');
        btnAccion.className = 'action-button';
        btnAccion.innerHTML = '<i class="bi bi-pencil me-2"></i>Editar';
        btnAccion.onclick = () => mostrarModal(item);
        celdaAccion.appendChild(btnAccion);
        fila.appendChild(celdaAccion);

        tbody.appendChild(fila);
      });
    }

    
    /// MODAL EDITAR 
    function mostrarModal(item) {
      document.getElementById('detallePaciente').value = item.NOMBRE_PACIENTE;
      document.getElementById('detalleMedico').value = item.NOMBRE_MEDICO;
      document.getElementById('detalleEdad').value = item.EDAD;
      document.getElementById('detalleProblemas').value = item.PROBLEMAS;
      document.getElementById('detalleIdentificacion').value = item.IDENTIFICACION;
      document.getElementById('detalleTratamiento').value = item.TRATAMIENTO;
      document.getElementById('detalleDetalles').value = item.DETALLES;
      document.getElementById('detalleMedicamentos').value = item.MEDICAMENTOS;
      document.getElementById('detalleGravedaPaciente').value = item.GRAVEDA_PACIENTE;

      document.getElementById('modalDetalle').style.display = 'flex';
    }


    // CARGAR HISTORIAL MÉDICO
    // Cargar el historial de manera asíncrona
    // y renderizar la tabla
    async function cargarHistorial() {
      try {
        const respuesta = await fetch('/empleado/historial-medico');
        if (!respuesta.ok) {
          throw new Error('Error al obtener la información');
        }
        const data = await respuesta.json();
        renderTabla(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el historial médico"
        });
      }
    }

    // ACTUALIZAR REPORTE
    function guardarCambios() {

      const id = document.getElementById('detalleIdentificacion').value;
      const tratamiento = document.getElementById('detalleTratamiento').value;
      const problemas = document.getElementById('detalleProblemas').value;
      const detalles = document.getElementById('detalleDetalles').value;
      const medicamentos = document.getElementById('detalleMedicamentos').value;
      const gravedad = document.getElementById('detalleGravedaPaciente').value;

      fetch('/empleado/actualizar-reporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identificacion: id,
          tratamiento: tratamiento,
          problemas: problemas,
          detalles: detalles,
          medicamentos: medicamentos,
          gravedad: gravedad
        })
      })
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          title: "¡Éxito!",
          text: "Reporte actualizado correctamente",
          icon: "success"
        }).then(() => {
          cerrarModal();
          cargarHistorial();
        });
      })
      .catch(error => {
        console.error('Error actualizando reporte:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el reporte"
        });
      });
    }



    // CERRAR MODAL
    function cerrarModal() {
      // Desaparecer el modal
      document.getElementById('modalDetalle').style.display = 'none';
    }

    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
      const modal = document.getElementById('modalDetalle');
      if (event.target === modal) {
        cerrarModal();
      }
    }


    // BÚSQUEDA
    const inputBusqueda = document.getElementById('busqueda');
    inputBusqueda.addEventListener('input', () => {
      const filtro = inputBusqueda.value.toLowerCase();
      const filas = document.querySelectorAll('#tablaHistorialMedico tbody tr');

      filas.forEach(fila => {
        const celdaIdentificacion = fila.cells[5];
        if (celdaIdentificacion) {
          const textoIdentificacion = celdaIdentificacion.textContent.toLowerCase();
          fila.style.display = textoIdentificacion.includes(filtro) ? '' : 'none';
        }
      });
    });

    document.addEventListener('DOMContentLoaded', cargarHistorial);