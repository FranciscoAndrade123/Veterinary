function filtrarEspecialidad() {
    // Esta función solo necesita llamar a actualizarTablaEspecialidades
    // ya que la lógica de filtrado ya está en obtenerEspecialidades
    actualizarTablaEspecialidades();
}


document.addEventListener("DOMContentLoaded", function () {

    // Cargar las especialidades al iniciar la página
    actualizarTablaEspecialidades();

    // Agregar evento al botón de búsqueda
    const buscarBtn = document.querySelector(".filtrar-veterinarios button");
    if (buscarBtn) {
        buscarBtn.addEventListener("click", actualizarTablaEspecialidades);
    }

    // Configurar evento para la tecla Enter en el campo de búsqueda
    const filtroInput = document.getElementById("nameFilter");
    if (filtroInput) {
        filtroInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                filtrarEspecialidad();
            }
        });
    }

    // También podemos agregar un evento para limpiar el filtro cuando se borre el texto
    if (filtroInput) {
        filtroInput.addEventListener("input", function () {
            if (this.value === "") {
                filtrarEspecialidad(); // Actualizar sin filtro cuando se borra el texto
            }
        });
    }
    // Evento para el botón de agregar especialidad
    const botonEnvio = document.getElementById("botonEspecialidad");
    if (botonEnvio) {
        botonEnvio.addEventListener('click', async function (event) {
            event.preventDefault();

            const nombreEspecialidad = document.getElementById("nombreEspecialidad").value.trim();
            console.log("nombreEspecialidad capturado:", `"${nombreEspecialidad}"`);


             // Que no este vacio el campo
                if (nombreEspecialidad === "") {
                    Swal.fire({
                        icon: "error",
                        title: "Campo vacío",
                        text: "Por favor, ingrese un nombre para la especialidad.",
                    });
                    return;
             }

            // Validaciones
            if (!nombreEspecialidad || !/^[a-zA-Z\s]+$/.test(nombreEspecialidad) || nombreEspecialidad.length < 3 || nombreEspecialidad.length > 50) {
                Swal.fire({
                    icon: "error",
                    title: "Datos inválidos",
                    text: "El nombre de la especialidad debe contener entre 3 y 50 caracteres y no puede contener números ni caracteres especiales.",
              });
                return;
            }

            //Empaquetar el body para enviarlo al servidor
            const bodyContent = JSON.stringify({
                "specialtyName": nombreEspecialidad
            });

            try {
                const response = await fetch("http://localhost:8080/api/v1/specialty/", {
                    method: "POST",
                    body: bodyContent,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                console.log("Respuesta del servidor (POST especialidad):", data);

                if (!response.ok) {
                    throw new Error(data.message || "Error al registrar la especialidad");
                }

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }

                // Limpiar el campo
                document.getElementById("nombreEspecialidad").value = "";

                // Actualizar la tabla con los nuevos datos
                actualizarTablaEspecialidades();

                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "La especialidad se ha registrado correctamente.",
                });

                return data;
            } catch (error) {
                console.error("❌ Error al registrar especialidad", error);
                alert("Error al registrar la especialidad: " + error.message);
                throw error;
            }
        });
    }
});

//Obtiene los datos del servidor y lo muestra
function obtenerEspecialidades() {
    return new Promise(async (resolve, reject) => {
        try {
            var url = "http://localhost:8080/api/v1/specialty/";
            var filtro = document.getElementById("nameFilter").value;

            if (filtro != "") { //si el filtro no está vacio que le muestre los datos según eso
                url += "filter/" + filtro;
            }

            let headersList = {
                "Accept": "*/*",
                "User-Agent": "web",
                "Content-Type": "application/json"
            };

            let response = await fetch(url, {
                method: "GET",
                headers: headersList
            });

            if (!response.ok) {
                throw new Error("Error al obtener especialidades");
            }



            const data = await response.json();
            console.log(data)
            resolve(data);
        } catch (error) {
            console.error("Error al obtener especialidades:", error);
            reject(error);
        }
    });
}

//Función donde crea la tabla en el html de la especialidad
function actualizarTablaEspecialidades() {
    obtenerEspecialidades()

        .then(especialidades => {
            console.log(especialidades)
            const tbody = document.querySelector(".veterinarios-table tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

            if (especialidades.length === 0) {
                // Mostrar mensaje cuando no hay resultados
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td colspan="3" class="text-center">
                        No se encontraron especialidades con ese filtro
                    </td>
                `;
                tbody.appendChild(tr);
                return;
            }

            // Para cada especialidad, crear una fila en la tabla
            especialidades.forEach(especialidad => {
                console.log("Especialidad recibida:", especialidad);
            
                // Manejar ambas estructuras de datos
                const id = especialidad.id || especialidad._specialtyID || "ID no disponible";
                const nombre = especialidad.specialtyName || especialidad._specialtyName || "Nombre no disponible";
            
                console.log("ID:", id, "Nombre:", nombre);
            
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><span class="vet-id">${id}</span></td>
                    <td>${nombre}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" data-id="${id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Agregar eventos a los botones de editar y eliminar
            agregarEventosBotones();
        })
        .catch(error => {
            console.error("Error al actualizar la tabla:", error);
        });
}


//Función para editar el nombre de la tabla
function editarEspecialidad(id) {
    // Obtener los datos actuales de la especialidad
    fetch(`http://localhost:8080/api/v1/specialty/${id}`, {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la especialidad");
            }
            return response.json();
        })
        .then(especialidad => {
            // Crear un modal de edición dinámicamente o usar uno existente
            let modalHtml = `
            <div class="modal fade" id="editarEspecialidadModal" tabindex="-1" aria-labelledby="editarEspecialidadModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editarEspecialidadModalLabel">Editar Especialidad</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEditarEspecialidad">
                                <div class="mb-3">
                                    <label for="editarNombreEspecialidad" class="form-label">Nombre de la Especialidad</label>
                                    <input type="text" class="form-control" id="editarNombreEspecialidad" value="${especialidad.specialtyName}" required>
                                    <input type="hidden" id="especialidadId" value="${id}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="guardarEdicionEspecialidad">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

            // Eliminar el modal anterior si existe
            const modalAnterior = document.getElementById('editarEspecialidadModal');
            if (modalAnterior) {
                modalAnterior.remove();
            }

            // Agregar el nuevo modal al DOM
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            // Inicializar el modal de Bootstrap
            const modalElement = document.getElementById('editarEspecialidadModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();

            // Agregar evento al botón de guardar cambios
            document.getElementById('guardarEdicionEspecialidad').addEventListener('click', function () {
                guardarEdicionEspecialidad();
            });
        })
        .catch(error => {
            console.error("Error al cargar datos para edición:", error);
            alert("Error al cargar los datos de la especialidad: " + error.message);
        });
}

function guardarEdicionEspecialidad() {
    const id = document.getElementById('especialidadId').value;
    const nombreEspecialidad = document.getElementById('editarNombreEspecialidad').value.trim();

             // Que no este vacio el campo
             if (nombreEspecialidad === "") {
                Swal.fire({
                    icon: "error",
                    title: "Campo vacío",
                    text: "Por favor, ingrese un nombre para la especialidad.",
                });
                return;
         }


    const bodyContent = JSON.stringify({
        "specialtyName": nombreEspecialidad
    });

    fetch(`http://localhost:8080/api/v1/specialty/${id}`, {
        method: "PUT",
        body: bodyContent,
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || "Error al actualizar la especialidad");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Respuesta del servidor (PUT especialidad):", data);

            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarEspecialidadModal'));
            if (modal) {
                modal.hide();
            }

               //Mostrar modal de éxito de registro
         Swal.fire({
            icon: "success",
            title: "Actualizado exitosamente!",
            text: "La especialidad ha sido actualizado correctamente.",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
           confirmButtonText: "Aceptar"
           });
        

            // Actualizar la tabla con los nuevos datos
            actualizarTablaEspecialidades();
        })
        .catch(error => {
            console.error("❌ Error al actualizar especialidad", error);
        });
}

//Función de elimiar la tabla en el html de la especialidad 
//Función de eliminar la especialidad
function eliminarEspecialidad(id) {
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
            fetch(`http://localhost:8080/api/v1/specialty/${id}`, {
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
                        throw new Error(data.message || "Error al eliminar la especialidad");
                    });
                }

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'La especialidad ha sido eliminada exitosamente.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });

                // Actualizar la tabla solo si la eliminación fue exitosa
                actualizarTablaEspecialidades();

                return { success: true };
            })
            .catch(error => {
                console.error("Error al eliminar especialidad:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Error al eliminar la especialidad: " + error.message,
                });
            });
        }
    });
}





//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            editarEspecialidad(id);
        });
    });

    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            eliminarEspecialidad(id);
        });
    });
}


