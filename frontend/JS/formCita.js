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
                    alert("Por favor, completa todos los campos.");
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
                    alert("No puedes seleccionar una fecha pasada.");
                    return;
                }

                if (fechaSeleccionada > fechaMaxima) {
                    alert("No puedes seleccionar una fecha que exceda un mes desde hoy.");
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
                    alert("Cita registrada correctamente");
                    window.location.href = "citasAgendadas.html";
                } catch (error) {
                    console.error("Error:", error);
                    alert("Hubo un problema al registrar la cita. Inténtalo de nuevo.");
                }
            });
        }
    } else if (currentPage.includes("citasAgendadas.html")) {
        // Lógica para mostrar citas agendadas
        async function cargarCitas() {
            try {
                // Obtener citas
                const citas = await fetch("http://localhost:8080/api/v1/appointment/").then((res) => res.json());
                console.log("Citas:", citas);
                
                // Obtener las demás entidades (por si necesitamos cruzar información)
                const tratamientos = await fetch("http://localhost:8080/api/v1/treatment/").then((res) => res.json());
                const appointmentTreatments = await fetch("http://localhost:8080/api/v1/appointmentTreatment/").then((res) => res.json());
                
                const contenedorCitas = document.querySelector(".agendamiento");
                contenedorCitas.innerHTML = ''; // Limpiar el contenedor
        
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
        cargarCitas();
    }
});


//Función de eliminar cita 
function eliminarCita (id){
    if (confirm("¿Está seguro de que desea eliminar esta cita?")) {
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

            // Si la eliminación fue exitosa, actualizar la tabla
            console.log("Cita eliminada correctamente");
            window.location.reload(); // Recargar la página
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar la cita:", error);
            alert("Error al eliminar la cita: " + error.message);
        });
    }    
}

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
                                    <select id="editarCliente" class="form-select" required>
                                        <!-- Opciones se llenarán dinámicamente -->
                                    </select>
                                    <br>
                                    <label for="editarVeterinario" class="form-label">Veterinario</label>
                                    <select id="editarVeterinario" class="form-select" required>
                                        <!-- Opciones se llenarán dinámicamente -->
                                    </select>
                                    <br>
                                    <label for="editarTratamiento" class="form-label">Tratamiento</label>
                                    <select id="editarTratamiento" class="form-select" required>
                                        <!-- Opciones se llenarán dinámicamente -->
                                    </select>
                                    <br>
                                    <label for="editarSede" class="form-label">Sede</label>
                                    <select id="editarSede" class="form-select" required>
                                        <!-- Opciones se llenarán dinámicamente -->
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
        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById('editarCitaModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Agregar evento al botón de guardar cambios
        document.getElementById('guardarCita').addEventListener('click', function() {
            //guardarEdicionCita();
        });
    })
    .catch(error => {
        console.error("Error al cargar datos para edición:", error);
        alert("Error al cargar los datos de la cita: " + error.message);
    });


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


