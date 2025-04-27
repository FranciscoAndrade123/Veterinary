document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes("formularioCita.html")) {
        // Lógica para registrar citas
        const btnEnviar = document.getElementById("botonCita");

        // Cargar las listas desplegables solo si estamos en la página de formulario
        obternerListaRaza();
        obternerListaClientes();
        obtenerListaSede();
        obtenerListaVeterinarios();
        obtenerListaTratamientos();

        if (btnEnviar) {
            btnEnviar.addEventListener("click", async function (e) {
                e.preventDefault(); // Evitar el envío del formulario por defecto

                // Obtener los valores de los campos del formulario
                const nombreCliente = document.getElementById("listaCliente").value;
                const nombreMascota = document.getElementById("nombreMascota").value;
                const razaMascota = document.getElementById("listaRaza").value;
                const tratamiento = document.getElementById("listaTratamientos").value;
                const sede = document.getElementById("listaSede").value;
                const fecha = document.getElementById("fechaCita").value;
                const veterinario = document.getElementById("listaVeterinarios").value;

                // Validar que todos los campos estén llenos
                if (!nombreCliente || !nombreMascota || !razaMascota || !sede || !fecha || !veterinario || !tratamiento) {
                    Swal.fire({
                        icon: "warning",
                        title: "Error",
                        text: "Por favor, completa todos los campos.",
                      });
                    return;
                }

                // Validar la fecha
                const fechaSeleccionada = new Date(fecha);
                const fechaActual = new Date();
                const fechaMaxima = new Date();
                fechaMaxima.setMonth(fechaActual.getMonth() + 1); // Fecha máxima: 1 mes desde hoy

                // Eliminar la hora para comparar solo las fechas
                fechaActual.setHours(0, 0, 0, 0);
                fechaSeleccionada.setHours(0, 0, 0, 0);
                fechaMaxima.setHours(0, 0, 0, 0);

                if (fechaSeleccionada < fechaActual) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No puedes seleccionar una fecha anterior a hoy.",
                      });
                    return;
                }

                if (fechaSeleccionada > fechaMaxima) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No puedes seleccionar una fecha más allá de un mes.",
                      });
                    return;
                }

                try {
                    // Paso 1: Registrar la mascota
                    const mascotaData = JSON.stringify({
                        petName: nombreMascota,
                        clientID: nombreCliente,
                        breedID: razaMascota,
                    });

                    const petResponse = await fetch("http://localhost:8080/api/v1/pet/", {
                        method: "POST",
                        body: mascotaData,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!petResponse.ok) {
                        throw new Error("Error al registrar la mascota");
                    }

                    const mascotas = await fetch("http://localhost:8080/api/v1/pet/").then((res) => res.json());
                    const mascota = mascotas.find((pet) => pet.petName === nombreMascota);
                    const mascotaID = mascota.petID;

                    // Paso 2: Registrar la cita
                    const citaData = JSON.stringify({
                        appointmentDate: fecha,
                        petID: mascotaID,
                        veterinarianID: veterinario,
                        placeID: sede,
                    });

                    const appointmentResponse = await fetch("http://localhost:8080/api/v1/appointment/", {
                        method: "POST",
                        body: citaData,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!appointmentResponse.ok) {
                        throw new Error("Error al registrar la cita");
                    }

                    // Paso 3: Registrar la tabla pivote appointmentTreatment
                    const citas = await fetch("http://localhost:8080/api/v1/appointment/").then((res) => res.json());
                    const cita = citas.find((app) => app.appointmentDate === fecha);
                    const citaID = cita.appointmentID;

                    const appointmentTreatmentData = JSON.stringify({
                        appointmentID: citaID,
                        treatmentID: tratamiento,
                    });

                    const appointmentTreatmentResponse = await fetch("http://localhost:8080/api/v1/appointmentTreatment/", {
                        method: "POST",
                        body: appointmentTreatmentData,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!appointmentTreatmentResponse.ok) {
                        throw new Error("Error al registrar el tratamiento de la cita");
                    }

                    // Redirigir a la página de citas agendadas
                    //Mostrar modal de éxito de registro
                    Swal.fire({
                        icon: "success",
                        title: "¡Registro exitoso!",
                        text: "Cita registrada correctamente.",
                        showConfirmButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Aceptar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Redirigir a la página de citas agendadas
                            window.location.href = "citasAgendadas.html";
                        }
                    });
                } catch (error) {
                    console.error("Error:", error);
                    alert("Hubo un problema al registrar la cita. Inténtalo de nuevo.");
                }
            });
        }
    } else if (currentPage.includes("citasAgendadas.html")) {
        // Función para cargar citas con diferentes filtros
    async function cargarCitas(filtro = null, valor = null) {
        try {
            let citas;
            
            // Determinar qué endpoint usar basado en el tipo de filtro
            if (filtro === "estado" && (valor === "activo" || valor === "inactivo")) {
                // Filtrar por estado (activo/inactivo)
                citas = await fetch(`http://localhost:8080/api/v1/appointment/filter/${valor}`).then((res) => res.json());
                console.log(`Citas filtradas por estado (${valor}):`, citas);
            } else if (filtro === "mascota" && valor) {
                // Filtrar por nombre de mascota
                citas = await fetch(`http://localhost:8080/api/v1/appointment/filterPetName/${valor}`).then((res) => res.json());
                console.log(`Citas filtradas por nombre de mascota (${valor}):`, citas);
            } else {
                // Cargar todas las citas si no hay filtro
                citas = await fetch("http://localhost:8080/api/v1/appointment/").then((res) => res.json());
                console.log("Todas las citas:", citas);
            }
            
            // Obtener las demás entidades (por si necesitamos cruzar información)
            const tratamientos = await fetch("http://localhost:8080/api/v1/treatment/").then((res) => res.json());
            const appointmentTreatments = await fetch("http://localhost:8080/api/v1/appointmentTreatment/").then((res) => res.json());
            
            const contenedorCitas = document.querySelector(".agendamiento");
            contenedorCitas.innerHTML = ''; // Limpiar el contenedor
    
            if (!citas || citas.length === 0) {
                contenedorCitas.innerHTML = '<div class="no-citas">No se encontraron citas con los criterios de búsqueda.</div>';
                return;
            }
    
            citas.forEach((cita) => {
                console.log("Procesando cita:", cita);
                
                // Acceder directamente a los datos anidados
                const mascota = cita.pet || {};
                const cliente = mascota.client || {};
                const raza = mascota.breed || {};
                const veterinario = cita.veterinarian || {};
                const lugar = cita.place || {};
                
                // Obtener tratamiento a través de la tabla pivote
                let tratamiento = {};
                const appointmentTreatmentsList = Array.isArray(appointmentTreatments) 
                    ? appointmentTreatments 
                    : appointmentTreatments.data || [];
                
                const apptTreatment = appointmentTreatmentsList.find(at => at.appointmentID === cita.appointmentID);
                
                if (apptTreatment && apptTreatment.treatmentID) {
                    tratamiento = tratamientos.find(t => 
                        t.treatmentId === apptTreatment.treatmentID || 
                        t.id === apptTreatment.treatmentID
                    ) || {};
                }
                
                // Crear la tarjeta de cita
                const citaCard = document.createElement("div");
                citaCard.classList.add("cita-card");
                citaCard.innerHTML = `
                    <div class="cita-header">
                        <div class="cita-mascota">
                            <div class="cita-mascota-icono">
                                <i class="fas fa-dog"></i>
                            </div>
                            <div class="cita-mascota-info">
                                <h4>${mascota.petName || "Sin nombre"}</h4>
                                <p>Dueño: ${cliente.clientName || "Sin dueño"}</p>
                            </div>
                        </div>
                    </div>
                    <div class="cita-body">
                        <div class="cita-columna">
                            <div class="cita-info">
                                <strong>Raza:</strong>
                                <span>${raza.breedName || "Sin raza"}</span>
                            </div>
                            <div class="cita-info">
                                <strong>Veterinario:</strong>
                                <span>${veterinario._veterinarianName || "Sin veterinario"}</span>
                            </div>
                            <div class="cita-info">
                                <strong>Lugar:</strong>
                                <span>${lugar.placeName || "Sin lugar"}</span>
                            </div>
                        </div>
                        <div class="cita-columna">
                            <div class="cita-info">
                                <strong>Tratamiento:</strong>
                                <span>${tratamiento.treatmentName || "Sin tratamiento"}</span>
                            </div>
                            <div class="cita-info">
                                <strong>Teléfono:</strong>
                                <span>${cliente.phone || "Sin teléfono"}</span>
                            </div>
                            <div class="cita-info">
                                <strong>Estado:</strong>
                                <span>${cita.status ? 'Activo' : 'Cancelada' || "Sin estado"}</span>
                            </div>
                        </div>
                        <div class="cita-fecha">
                            <div class="fecha">${cita.appointmentDate || "Sin fecha"}</div>
                        </div>
                        
                    </div>
                     <div class="cita-acciones">
                    <button class="btn-accion btn-editar" data-id="${cita.appointmentID}" >
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-accion btn-eliminar" data-id="${cita.appointmentID}" >
                     <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                    </div>
                `;
                contenedorCitas.appendChild(citaCard);
            });
            agregarEventosBotones(); // Agregar eventos a los botones de eliminar y actualizar
        } catch (error) {
            console.error("Error al cargar las citas:", error);
        }
    }

    // Agregar evento al botón de búsqueda para filtrar
    document.getElementById("btnBuscar").addEventListener("click", filtrarCitas);
    
    // Agregar evento al campo de búsqueda
    const inputBusqueda = document.getElementById("buscarMascota");
    
    // Evento para detectar cuando se presiona Enter
    inputBusqueda.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            filtrarCitas();
        }
    });
    
    // Evento para detectar cuando el campo está vacío
    inputBusqueda.addEventListener("input", function() {
        if (this.value.trim() === "") {
            cargarCitas(); // Cargar todas las citas cuando el campo está vacío
        }
    });

    // Función para filtrar citas según el término ingresado
    function filtrarCitas() {
        const terminoBusqueda = document.getElementById("buscarMascota").value.trim().toLowerCase();
        
        // Si el campo está vacío, cargar todas las citas
        if (terminoBusqueda === "") {
            cargarCitas();
            return;
        }
        
        // Verificar si el término es "activo" o "inactivo"
        if (terminoBusqueda === "activo" || terminoBusqueda === "inactivo") {
            cargarCitas("estado", terminoBusqueda);
        } else {
            // Si no es un estado, asumir que es nombre de mascota
            cargarCitas("mascota", terminoBusqueda);
        }
    }
    
    // Cargar todas las citas al iniciar la página
    cargarCitas();
    }
})



//Función de eliminar cita 
function eliminarCita (id){
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/api/v1/appointment/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "User-Agent": "web",
                    "Content-Type": "application/json"
                }
            })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || "Error al eliminar la cita");
                });
            }

            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "Cita eliminada correctamente.",
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); // Recargar la página
                }
            });
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar la cita:", error);
            alert("Error al eliminar la cita: " + error.message);
        });
    }    
})}

function editarCita(id) {
    // Obtener los datos actuales de la cita
    console.log("ID de la cita a editar:", id);
    fetch(`http://localhost:8080/api/v1/appointment/${id}`, {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos del veterinario y especialidad ");
        }
        return response.json();
    })
    .then(cita => {
        console.log("Datos de la cita seleccionada:", cita);

        const nombreMascota = cita.pet?.petName || "Sin nombre";
        const fechaCita = cita.appointmentDate || "";

        let modalHtml = `
            <div class="modal fade" id="editarCitaModal" tabindex="-1" aria-labelledby="editarCitaModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editarCitaModalLabel">Editar Cita</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEditarCita">
                                <div class="mb-3">
                                    <label for="editarNombreMascota" class="form-label">Nombre de la Mascota</label>
                                    <input type="text" class="form-control" id="editarNombreMascota" value="${nombreMascota}" required>
                                    <br>
                                    <label for="editarCliente" class="form-label">Cliente</label>
                                       <select  class="form-control" id="listaCliente" required>
                                   </select>
                                    <br>
                                    <label for="editarCliente" class="form-label">Raza</label>
                                       <select  class="form-control" id="listaRaza" required>
                                   </select>
                                     <br>
                                    <label for="editarVeterinario" class="form-label">Veterinario</label>
                                     <select class="form-control"  id="listaVeterinarios" required>
                                    </select>
                                    <br>
                                    <label for="editarTratamiento" class="form-label">Tratamiento</label>
                                   <select class="form-control" id="listaTratamientos" required>
                                  </select>
                                    <br>
                                    <label for="editarSede" class="form-label">Sede</label>
                                  <select class="form-control" id="listaSede" required>
                                    </select>
                                    <br>
                                    <label for="editarFechaCita" class="form-label">Fecha de la Cita</label>
                                    <input type="date" class="form-control" id="editarFechaCita" value="${fechaCita}" required>
                                    <input type="hidden" id="citaID" value="${id}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="guardarCita">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eliminar el modal anterior si existe
        const modalAnterior = document.getElementById('editarCitaModal');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar el nuevo modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Llenar las listas desplegables
        // Llenar las listas desplegables con las funciones correctas
        obternerListaClientes(cita.pet?.client?.id_client);
        obtenerListaVeterinarios(cita.veterinarian?.veterinarianID);
        obtenerListaTratamientos(cita.treatmentID);
        obtenerListaSede(cita.place?.placeID);
        obternerListaRaza(cita.breed?.id);
        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById('editarCitaModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Agregar evento al botón de guardar cambios
        document.getElementById('guardarCita').addEventListener('click', async function () {
            try {
                // Obtener los valores del formulario
                const valoresFormulario = obtenerValoresFormulario();
                const citaID = document.getElementById("citaID").value;
        
                // Validar que todos los campos estén llenos
                if (!valoresFormulario.nombreMascota || 
                    !valoresFormulario.clienteSeleccionado || 
                    !valoresFormulario.veterinarioSeleccionado || 
                    !valoresFormulario.tratamientoSeleccionado || 
                    !valoresFormulario.sedeSeleccionada || 
                    !valoresFormulario.fechaCita || 
                    !valoresFormulario.razaSeleccionada) {
                        Swal.fire({
                            icon: "warning",
                            title: "Error",
                            text: "Por favor, completa todos los campos.",
                          });
                    return;
                }
        
                // Paso 1: Actualizar la mascota (incluyendo raza)
                const mascotaData = JSON.stringify({
                    petName: valoresFormulario.nombreMascota,
                    clientID: valoresFormulario.clienteSeleccionado,
                    breedID: valoresFormulario.razaSeleccionada, // Incluye la raza
                });
        
                const petResponse = await fetch(`http://localhost:8080/api/v1/pet/${citaID}`, {
                    method: "PUT",
                    body: mascotaData,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        
                if (!petResponse.ok) {
                    throw new Error("Error al actualizar la mascota");
                }
        
                // Paso 2: Actualizar la cita
                const citaData = JSON.stringify({
                    appointmentDate: valoresFormulario.fechaCita,
                    petID: citaID,
                    veterinarianID: valoresFormulario.veterinarioSeleccionado,
                    placeID: valoresFormulario.sedeSeleccionada,
                });
        
                const appointmentResponse = await fetch(`http://localhost:8080/api/v1/appointment/${citaID}`, {
                    method: "PUT",
                    body: citaData,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        
                if (!appointmentResponse.ok) {
                    throw new Error("Error al actualizar la cita");
                }
        
                // Paso 3: Actualizar la tabla pivote appointmentTreatment
                const appointmentTreatmentData = JSON.stringify({
                    appointmentID: citaID,
                    treatmentID: valoresFormulario.tratamientoSeleccionado,
                });
        
                const appointmentTreatmentResponse = await fetch(`http://localhost:8080/api/v1/appointmentTreatment/${citaID}`, {
                    method: "PUT",
                    body: appointmentTreatmentData,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        
                if (!appointmentTreatmentResponse.ok) {
                    throw new Error("Error al actualizar el tratamiento de la cita");
                }
        
                // Redirigir a la página de citas agendadas
                Swal.fire({
                    icon: "success",
                    title: "¡Actualización exitosa!",
                    text: "Cita actualizada correctamente.",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirigir a la página de citas agendadas
                        window.location.href = "citasAgendadas.html";
                    }
                });
            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema al actualizar la cita. Inténtalo de nuevo.");
            }
        });
    })
    .catch(error => {
        console.error("Error al cargar datos para edición:", error);
        alert("Error al cargar los datos de la cita: " + error.message);
    });


}

//Funcion para obtener los valores de los campos del formulario 
function obtenerValoresFormulario() {
    const nombreMascota = document.getElementById("editarNombreMascota").value;
    const clienteSeleccionado = document.getElementById("listaCliente").value;
    const razaSeleccionada = document.getElementById("listaRaza").value; // Nuevo campo para la raza
    const veterinarioSeleccionado = document.getElementById("listaVeterinarios").value;
    const tratamientoSeleccionado = document.getElementById("listaTratamientos").value;
    const sedeSeleccionada = document.getElementById("listaSede").value;
    const fechaCita = document.getElementById("editarFechaCita").value;

    return {
        nombreMascota,
        clienteSeleccionado,
        razaSeleccionada, // Incluye la raza
        veterinarioSeleccionado,
        tratamientoSeleccionado,
        sedeSeleccionada,
        fechaCita
    };
}





//Botones
function agregarEventosBotones() {
     // Eventos para botones de editar
     document.querySelectorAll(".btn-editar").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarCita(id);
        });
    });
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            eliminarCita(id);
        });
    });
}



/****** FUNCIONES DE LAS LISTAS DESPLEGABLES LLAMADAS DESDE EL SERVIDOR ********/
//Obtenemos la lista de clientes y la llenamos en el select
function obternerListaClientes() {
    const selectorCliente = document.getElementById("listaCliente");

    if (!selectorCliente) {
        console.error("El elemento con ID 'listaCliente' no existe en el DOM.");
        return;
    }

    // Realizar una solicitud al servidor para obtener los clientes
    fetch("http://localhost:8080/api/v1/client/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los clientes");
            }
            return response.json();
        })
        .then(clientes => {
            // Limpiar el select antes de llenarlo
            selectorCliente.innerHTML = '<option value="">Seleccione un cliente</option>';

            // Agregar las opciones al select
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id_client || cliente.id; // Ajusta según el nombre de la propiedad
                option.textContent = cliente.clientName || cliente.name; // Ajusta según el nombre de la propiedad
                selectorCliente.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar los clientes:", error);
        });
}

//Obtenemos la lista de raza y la llenamos en el select
function obternerListaRaza() {
    const selectorRaza = document.getElementById("listaRaza");

    if (!selectorRaza) {
        console.error("El elemento con ID 'listaRaza' no existe en el DOM.");
        return;
    }
    // Realizar una solicitud al servidor para obtener las razas
    fetch("http://localhost:8080/api/v1/breed/")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener las razas");
        }
        return response.json();
    })
    .then(raza => {
        // Limpiar el select antes de llenarlo
        selectorRaza.innerHTML = '<option value="">Seleccione una raza</option>';

        // Agregar las opciones al select
        raza.forEach(raza => {
            const option = document.createElement("option");
            option.value = raza.id ; // Ajusta según el nombre de la propiedad
            option.textContent = raza.breedName ; // Ajusta según el nombre de la propiedad
            selectorRaza.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar los clientes:", error);
    });
}

//Obtenemos la lista de sede y la llenamos en el select
function obtenerListaSede() {
    const selectorSede = document.getElementById("listaSede");

    if (!selectorSede) {
        console.error("El elemento con ID 'listaSede' no existe en el DOM.");
        return;
    }
    // Realizar una solicitud al servidor para obtener las sedes
    fetch("http://localhost:8080/api/v1/place/")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener las sedes");
        }
        return response.json();
    })
    .then(sede => {
        // Limpiar el select antes de llenarlo
        selectorSede.innerHTML = '<option value="">Seleccione una sede</option>';

        // Agregar las opciones al select
        sede.forEach(sede => {
            const option = document.createElement("option");
            option.value = sede.id ; // Ajusta según el nombre de la propiedad
            option.textContent = sede.placeName ; // Ajusta según el nombre de la propiedad
            selectorSede.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar las sedes:", error);
    });
}

//Obtener la lista de veterinarios y la llenamos en el select
function obtenerListaVeterinarios() {
    const selectorVeterinario = document.getElementById("listaVeterinarios");

    if (!selectorVeterinario) {
        console.error("El elemento con ID 'listaVeterinarios' no existe en el DOM.");
        return;
    }
    // Realizar una solicitud al servidor para obtener las sedes
    fetch("http://localhost:8080/api/v1/veterinarian/")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los veterinarios");
        }
        return response.json();
    })
    .then(veterinario => {
        // Limpiar el select antes de llenarlo
        selectorVeterinario.innerHTML = '<option value="">Seleccione un veterinarios</option>';

        // Agregar las opciones al select
        veterinario.forEach(veterinario => {
            const option = document.createElement("option");
            option.value = veterinario._veterinarianID ; // Ajusta según el nombre de la propiedad
            option.textContent = veterinario._veterinarianName ; // Ajusta según el nombre de la propiedad
            selectorVeterinario.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar los veterinarios:", error);
    });
}

//Obtener lista tratamietos
function obtenerListaTratamientos() {
    const selectorTratamiento = document.getElementById("listaTratamientos");

    if (!selectorTratamiento) {
        console.error("El elemento con ID 'listaTratamiento' no existe en el DOM.");
        return;
    }

     // Realizar una solicitud al servidor para obtener los tratamientos
     fetch("http://localhost:8080/api/v1/treatment/")
     .then(response => {
         if (!response.ok) {
             throw new Error("Error al obtener los tratamientos");
         }
         return response.json();
     })
     .then(tratamiento => {
         // Limpiar el select antes de llenarlo
         selectorTratamiento.innerHTML = '<option value="">Seleccione tratamiento</option>';
 
         // Agregar las opciones al select
         tratamiento.forEach(tratamiento => {
             const option = document.createElement("option");
             option.value = tratamiento.treatmentId ; // Ajusta según el nombre de la propiedad
             option.textContent = tratamiento.treatmentName ; // Ajusta según el nombre de la propiedad
             selectorTratamiento.appendChild(option);
         });
     })
     .catch(error => {
         console.error("Error al cargar los veterinarios:", error);
     });


}
/**************/

//Botones


