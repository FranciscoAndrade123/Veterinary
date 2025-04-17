document.addEventListener("DOMContentLoaded", function () {
    const botonEnvioVeterinario = document.getElementById("botonEnvioVeterinario");

    if (botonEnvioVeterinario) {
        botonEnvioVeterinario.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del botón

            // Obtener los valores del formulario
            const nombre = document.getElementById("nombreVeterinario").value;
            const especialidadId = document.getElementById("opciones-epecialidades").value;

            // Validar que los campos no estén vacíos
            if (!nombre || !especialidadId) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            try {
                // Paso 1: Registrar el veterinario
                const veterinarioResponse = await fetch("http://localhost:8080/api/v1/veterinarian/", {
                    method: "POST",
                    body: JSON.stringify({ veterinarianName: nombre }),
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                if (!veterinarioResponse.ok) {
                    throw new Error("Error al registrar el veterinario");
                }

                // Paso 2: Obtener el ID del veterinario recién creado
                const veterinariosResponse = await fetch("http://localhost:8080/api/v1/veterinarian/");
                if (!veterinariosResponse.ok) {
                    throw new Error("Error al obtener la lista de veterinarios");
                }

                const veterinarios = await veterinariosResponse.json();
                const veterinario = veterinarios.find(vet => vet._veterinarianName === nombre);

                if (!veterinario) {
                    throw new Error("No se encontró el veterinario recién creado");
                }

                const veterinarioId = veterinario._veterinarianID;
                console.log("Veterinario registrado con ID:", veterinarioId);

                //************PIVOTEEEEEEE****************/////
                   // Paso 3: Registrar la relación en la tabla pivote
                    const pivoteResponse = await fetch("http://localhost:8080/api/v1/veterinarianSpecialty/", {
                    method: "POST",
                    body: JSON.stringify({
                    veterinarianID: veterinarioId,
                    specialtyID: especialidadId
                     }),
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });
                if (!pivoteResponse.ok) {
                    throw new Error("Error al registrar la relación en la tabla pivote");
                }
                // Manejar la respuesta como texto si no es JSON
                const responseText = await pivoteResponse.text();
                console.log("Respuesta del servidor (tabla pivote):", responseText);
                /******************/

                // Limpiar los campos del formulario
                document.getElementById("nombreVeterinario").value = "";
                document.getElementById("opciones-epecialidades").value = "";

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }

                 // Actualizar la tabla automáticamente
               actualizarTablaVeterinarioEspecialidades();

            } catch (error) {
                console.error("❌ Error al registrar el veterinario o la relación:", error);
            }
        });
    }
    // Llenar el select de especialidades al cargar la página
    cargarEspecialidades();
});


// Función para cargar las especialidades en el select
function cargarEspecialidades() {
    const selectEspecialidades = document.getElementById("opciones-epecialidades");

    // Realizar una solicitud al servidor para obtener las especialidades
    fetch("http://localhost:8080/api/v1/specialty/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener las especialidades");
            }
            return response.json();
        })
        .then(especialidades => {
            // Limpiar el select antes de llenarlo
            selectEspecialidades.innerHTML = '<option value="">Seleccione la especialidad</option>';

            // Agregar las opciones al select
            especialidades.forEach(especialidad => {
                const option = document.createElement("option");
                option.value = especialidad.id; // Usar el ID de la especialidad como valor
                option.textContent = especialidad.specialtyName; // Mostrar el nombre de la especialidad
                selectEspecialidades.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar las especialidades:", error);
        });
}

// Obtencion del nombre  del veterinario y la especialidad en la web de la tabla pivote
function obtenerVeterinarioYEspecialidades() {
    return new Promise(async (resolve, reject) => {
        try {
            let url = 'http://localhost:8080/api/v1/veterinarianSpecialty/';
            let filtro = document.getElementById("nameFilter").value;

            if (filtro !== '') {
                url += "filter/" + filtro;
            }

            let headersList = {
                "Accept": "*/*",
                "User-Agent": "web",
                "Content-Type": "application/json"
            };

            let response = await fetch(url, {
                method: 'GET',
                headers: headersList
            });

            if (!response.ok) {
                throw new Error("Error al obtener el nombre del veterinario y la especialidad");
            }

            const responseText = await response.text();
            console.log("Respuesta del servidor (texto):", responseText);

            // Intentar parsear la respuesta como JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                throw new Error("La respuesta del servidor no es un JSON válido");
            }

            if (data.length === 0) {
                console.log("No se encontraron datos en la tabla pivote.");
                resolve([]);
                return;
            }

            console.log("Datos recibidos del servidor:", data);
            resolve(data);
        } catch (error) {
            console.error("❌ Error al obtener las razas:", error);
            reject(error);
        }
    });
}



//Creacion de las tablas 
function actualizarTablaVeterinarioEspecialidades() {
    obtenerVeterinarioYEspecialidades()
        .then(vetYesp => {
            const tbody = document.querySelector(".veterinarios-table tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

            if (vetYesp.length === 0) {
                // Mostrar mensaje cuando no hay resultados
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td colspan="3" class="text-center">
                        No se encontraron veterinarios con ese filtro
                    </td>
                `;
                tbody.appendChild(tr);
                return;
            }

            vetYesp.forEach(vet => {
                const tr = document.createElement("tr");

                // Extraer los valores de la respuesta
                const id = vet.id || "Sin ID";
                const nombreVeterinario = vet.veterinarianID?._veterinarianName || "Sin nombre";
                const nombreEspecialidad = vet.specialtyID?._specialtyName || "Sin especialidad";

                tr.innerHTML = `
                    <td>${id}</td>
                    <td>${nombreVeterinario}</td>
                    <td class="especialidad-tag">${nombreEspecialidad}</td>
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
            console.error("❌ Error al actualizar la tabla de veterinarios y especialidades:", error);
        });
}
actualizarTablaVeterinarioEspecialidades();

//Funcion para eliminar el veterinario
function eliminarVeterinarioEspecialidad(id){
    if (confirm("¿Está seguro de que desea eliminar el registro del veterinario?")) {
        fetch(`http://localhost:8080/api/v1/veterinarianSpecialty/${id}`, {
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
                    throw new Error(data.message || "Error al eliminar el veterinario");
                });
            }

            // Si la eliminación fue exitosa, actualizar la tabla
            console.log("Veterinario eliminado correctamente");
            actualizarTablaVeterinarioEspecialidades(); // Llamada para recargar la tabla
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar la raza:", error);
            alert("Error al eliminar la raza: " + error.message);
        });
    }    
}

//Función para editar el veterinario
function editarVeterinarioEspecialidad(id){
    // Obtener los datos actuales de la raza
    fetch(`http://localhost:8080/api/v1/veterinarianSpecialty/${id}`, {
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

    .then(vetYesp => {
        console.log("Datos recibidos para edición:", vetYesp);

        const nombreVeterinario = vetYesp.veterinarianID?._veterinarianName || "Sin nombre";

        let modalHtml = `
            <div class="modal fade" id="editarVeterinarioModal" tabindex="-1" aria-labelledby="editarVeterinarioModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarVeterinarioModalLabel">Editar veterinario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarVeterinario">
                            <div class="mb-3">
                                <label for="editarNombreVeterinario" class="form-label">Nombre del veterinario</label>
                                <input type="text" class="form-control" id="editarNombreVeterinario" value="${nombreVeterinario}" required>
                                <br>
                                <label for="editarEspecialidad" class="form-label">Especialidad</label>
                                <select id="editarEspecialidad" class="form-select" required>
                                    <!-- Opciones se llenarán dinámicamente -->
                                </select>
                                <input type="hidden" id="veterinarioEspecialidad" value="${vetYesp.id}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="guardarVeterinario">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Eliminar el modal anterior si existe
        const modalAnterior = document.getElementById('editarVeterinarioModal');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar el nuevo modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Llenar el select de especialidades
        fetch("http://localhost:8080/api/v1/specialty/")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener las especialidades");
                }
                return response.json();
            })
            .then(especialidades => {
                const selectEspecialidad = document.getElementById("editarEspecialidad");
                especialidades.forEach(especialidad => {
                    const option = document.createElement("option");
                    option.value = especialidad.id; // Usar el ID de la especialidad como valor
                    option.textContent = especialidad.specialtyName; // Mostrar el nombre de la especialidad
                    if (especialidad.id === vetYesp.specialtyID?._specialtyID) {
                        option.selected = true; // Seleccionar la especialidad actual
                    }
                    selectEspecialidad.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error al cargar las especialidades:", error);
            });

        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById('editarVeterinarioModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Agregar evento al botón de guardar cambios
        document.getElementById('guardarVeterinario').addEventListener('click', function() {
            guardarEdicionVeterinario();
        });
    })
    .catch(error => {
        console.error("Error al cargar datos para edición:", error);
        alert("Error al cargar los datos del veterinario: " + error.message);
    });
}



//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarVeterinarioEspecialidad(id);
        });
    });
    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            eliminarVeterinarioEspecialidad(id);
        });
    });
}
