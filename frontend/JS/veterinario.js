const apiUrlPivote = "http://localhost:8080/api/v1/veterinarianSpecialty/";
const apiUrlVeterinario = "http://localhost:8080/api/v1/veterinarian/";
const apiUrlEspecialidad = "http://localhost:8080/api/v1/specialty/";



function filtrarVeterinarios (){
       // Esta función solo necesita llamar a actualizarTablaTratamientos
    // ya que la lógica de filtrado ya está en obtenerEspecialidades
    actualizarTablaVeterinarioEspecialidades();
}


document.addEventListener("DOMContentLoaded", function () {
    const botonEnvioVeterinario = document.getElementById("botonEnvioVeterinario");

    // Agregar evento al botón de búsqueda
    const botonFiltrar = document.querySelector(".filtrar-veterinarios button");
    if (botonFiltrar) {
        botonFiltrar.addEventListener("click", function() {
            actualizarTablaVeterinarioEspecialidades();
        });
    }
// Configurar evento para la tecla Enter en el campo de búsqueda
    const filtroInput = document.getElementById("nameFilter");
    if (filtroInput) {
        filtroInput.addEventListener("input", function(event){
            if(event.key === "Enter"){
                event.preventDefault();
                filtrarVeterinarios();
            }

        })
    }

// También podemos agregar un evento para limpiar el filtro cuando se borre el texto
    if (filtroInput){
        filtroInput.addEventListener("input" , function(event){
            if (this.value === "") {
                filtrarVeterinarios(); // Actualizar sin filtro cuando se borra el texto
            }
        } )
    }

    if (botonEnvioVeterinario) {
        botonEnvioVeterinario.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del botón

            // Obtener los valores del formulario
            const nombre = document.getElementById("nombreVeterinario").value;
            const especialidadId = document.getElementById("opciones-epecialidades").value;

            // Validar que los campos no estén vacíos
            if (!nombre || !especialidadId) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Por favor, completa todos los campos.",
                  });
                return;
            }

            
            // Validamos que no contengan números
            const contieneNumeros = /\d/; // Expresión regular para detectar números
            if (contieneNumeros.test(nombre)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "El nombre del veterinario no puede contener números.",
                  });
                return;
            }

            try {
                // Paso 1: Registrar el veterinario
                const veterinarioResponse = await fetch(apiUrlVeterinario, {
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
                const veterinariosResponse = await fetch(apiUrlVeterinario);
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
                    const pivoteResponse = await fetch(apiUrlPivote, {
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

                 //Mostrar modal de éxito de registro
                 Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: "Veterinario registrado correctamente.",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                   confirmButtonText: "Aceptar"
                   });

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
    fetch(apiUrlEspecialidad)
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
            let url = apiUrlPivote;
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
                    <td><span class="vet-id">${id}</span></td>
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
            fetch(`${apiUrlPivote}${id}`, {
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

             // Mostrar mensaje de éxito
             Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El Veterinario ha sido eliminado exitosamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
            actualizarTablaVeterinarioEspecialidades(); // Llamada para recargar la tabla
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar la raza:", error);
            alert("Error al eliminar la raza: " + error.message);
        });
    }    
} )}

//Función para editar el veterinario
function editarVeterinarioEspecialidad(id){
    // Obtener los datos actuales de la raza
    fetch(`${apiUrlPivote}${id}`, {
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
                                <input type="hidden" id="veterinarioID" value="${vetYesp.veterinarianID?._veterinarianID || vetYesp.veterinarianID}">
                                <input type="hidden" id="especialidadID" value="${vetYesp.specialtyID}">
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
        fetch(apiUrlEspecialidad)
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
            guardarEdicionVeterinarios();
        });
    })
    .catch(error => {
        console.error("Error al cargar datos para edición:", error);
        alert("Error al cargar los datos del veterinario: " + error.message);
    });
}


function guardarEdicionVeterinarios() {
    const idPivote = document.getElementById('veterinarioEspecialidad').value;
    const idVeterinario = document.getElementById('veterinarioID').value;
    const nuevoNombre = document.getElementById('editarNombreVeterinario').value;
    const nuevaEspecialidad = document.getElementById('editarEspecialidad').value;

    // Validar que los campos no estén vacíos
    if (!nuevoNombre || !nuevaEspecialidad) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Por favor, completa todos los campos.",
          });
        return;
    }
    // Validamos que no contengan números
    const contieneNumeros = /\d/; // Expresión regular para detectar números
    if (contieneNumeros.test(nuevoNombre)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El nombre del veterinario no puede contener números.",
          });
        return;
    }

    // Paso 1: Actualizar el nombre del veterinario
    fetch(`${apiUrlVeterinario}${idVeterinario}`, {
        method: "PUT",
        body: JSON.stringify({ veterinarianName: nuevoNombre }),
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al actualizar el nombre del veterinario");
        }
        return response.json();
    })
    .then(() => {
        console.log("Nombre del veterinario actualizado correctamente");

        // Paso 2: Actualizar la relación en la tabla pivote
        return fetch(`${apiUrlPivote}${idPivote}`, {
            method: "PUT",
            body: JSON.stringify({
                veterinarianID: idVeterinario,
                specialtyID: nuevaEspecialidad
            }),
            headers: {
                "Accept": "*/*",
                "User-Agent": "web",
                "Content-Type": "application/json"
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al actualizar la relación en la tabla pivote");
        }
        return response.json();
    })
    .then(() => {
        console.log("Relación en la tabla pivote actualizada correctamente");

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarVeterinarioModal'));
        if (modal) {
            modal.hide();
        }

           //Mostrar modal de éxito de registro
           Swal.fire({
            icon: "success",
            title: "Actualizado exitosamente!",
            text: "El veterinario ha sido actualizado correctamente.",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
           confirmButtonText: "Aceptar"
           });

        // Actualizar la tabla automáticamente
        actualizarTablaVeterinarioEspecialidades();
    })
    .catch(error => {
        console.error("❌ Error al guardar los cambios:", error);
        alert("Error al guardar los cambios: " + error.message);
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
