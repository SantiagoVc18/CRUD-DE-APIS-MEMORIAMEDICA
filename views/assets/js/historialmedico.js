
    // Renderiza la tabla con los datos del historial
    function renderTabla(historialData) {
      const tbody = document.querySelector('#tablaHistorial tbody');
      tbody.innerHTML = '';

      // Itera sobre los datos del historial y crea las filas de la tabla
      historialData.forEach(item => {
        const fila = document.createElement('tr');

        const celdaId = document.createElement('td');
        celdaId.textContent = item.ID;

        const celdaNombrePaciente = document.createElement('td');
        celdaNombrePaciente.textContent = item.NOMBRE_PACIENTE;

        const celdaNombreMedico = document.createElement('td');
        celdaNombreMedico.textContent = item.NOMBRE_MEDICO;

        const celdaFecha = document.createElement('td');
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const fechaFormateada = new Date(item.FECHA).toLocaleDateString('es-ES', options);
        celdaFecha.textContent = fechaFormateada;

        const celdaHora = document.createElement('td');
        celdaHora.textContent = item.HORA;

        const celdaMotivo = document.createElement('td');
        celdaMotivo.textContent = item.MOTIVO;

        const celdaTipoConsulta = document.createElement('td');

        const spanTipoConsulta = document.createElement('span');
        spanTipoConsulta.className = 'badge virtual';
        spanTipoConsulta.textContent = item.TIPO_CONSULTA;
        celdaTipoConsulta.appendChild(spanTipoConsulta);

        const celdaAccion = document.createElement('td');

        const btnAccion = document.createElement('button');
        btnAccion.type = 'button';
        btnAccion.className = 'action-button';

        const spanBotonAccion = document.createElement('span');
        spanBotonAccion.className = 'button-text';
        spanBotonAccion.textContent = 'Ver detalles';

        const spanBotonAccionIcono = document.createElement('span');
        spanBotonAccionIcono.className = 'button-icon';
        spanBotonAccionIcono.textContent = '→';

        btnAccion.appendChild(spanBotonAccion);
        btnAccion.appendChild(spanBotonAccionIcono);

        
        // Agrega un evento al botón para mostrar el modal
        btnAccion.onclick = () => {
          // Establece los valores en el modal
          document.getElementById('detallePaciente').textContent = item.NOMBRE_PACIENTE;
          document.getElementById('detalleMedico').textContent = item.NOMBRE_MEDICO;
          document.getElementById('detalleFecha').textContent = item.FECHA;
          document.getElementById('detalleHora').textContent = item.HORA;
          document.getElementById('detalleMotivo').textContent = item.MOTIVO;
          document.getElementById('detalleTipo').textContent = item.TIPO_CONSULTA;

          // Muestra el modal
          document.getElementById('modalDetalle').style.display = 'flex';
        };

        celdaAccion.appendChild(btnAccion);

        fila.appendChild(celdaId);
        fila.appendChild(celdaNombrePaciente);
        fila.appendChild(celdaNombreMedico);
        fila.appendChild(celdaFecha);
        fila.appendChild(celdaHora);
        fila.appendChild(celdaMotivo);
        fila.appendChild(celdaTipoConsulta);
        fila.appendChild(celdaAccion);

        tbody.appendChild(fila);
      });
    }

    async function cargarHistorial() {
      try {
        const respuesta = await fetch('/empleado//historial-citas');
        if (!respuesta.ok) {
          throw new Error('Error al obtener la información');
        }
        const data = await respuesta.json();
        renderTabla(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    document.addEventListener('DOMContentLoaded', cargarHistorial);

    
    function verDetalles(button) {
    document.getElementById('detallePaciente').textContent = button.dataset.paciente;
    document.getElementById('detalleMedico').textContent = button.dataset.medico;
    document.getElementById('detalleFecha').textContent = button.dataset.fecha;
    document.getElementById('detalleHora').textContent = button.dataset.hora;
    document.getElementById('detalleMotivo').textContent = button.dataset.motivo;
    document.getElementById('detalleTipo').textContent = button.dataset.tipo;

    document.getElementById('modalDetalle').style.display = 'flex';
  }

  function cerrarModal() {
    document.getElementById('modalDetalle').style.display = 'none';
  }

  // Cierra modal al hacer clic fuera del contenido
  window.onclick = function (event) {
    const modal = document.getElementById('modalDetalle');
    if (event.target === modal) {
      cerrarModal();
    }
  }

  //Buscar nombre 
  const inputBusqueda = document.getElementById('busqueda');
  const tabla = document.getElementById('tablaHistorial').getElementsByTagName('tbody')[0];

  inputBusqueda.addEventListener('input', () => {
    const filtro = inputBusqueda.value.toLowerCase();
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
      const celdaNombre = filas[i].getElementsByTagName('td')[1]; // Columna de nombre del paciente
      if (celdaNombre) {
        const textoNombre = celdaNombre.textContent.toLowerCase();
        filas[i].style.display = textoNombre.includes(filtro) ? '' : 'none';
      }
    }
  });

  function generarReporte() {
    const paciente = document.getElementById('detallePaciente').textContent;
    const medico = document.getElementById('detalleMedico').textContent;
    window.location.href = `reporte.html?paciente=${encodeURIComponent(paciente)}&medico=${encodeURIComponent(medico)}`;
  }