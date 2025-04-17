function filtrarRaza() {
    // Esta función solo necesita llamar a actualizarTablaRaza
    // ya que la lógica de filtrado ya está en obtenerRazas
    actualizarTablaRaza();

}


document.addEventListener("DOMContentLoaded", function() {
    //Declaramos primero el boton de envio de nombre de la raza y sus caracteristicas
    const botonEnvioRaza = document.getElementById("botonRaza");



    // Agregar evento al botón de búsqueda
    const botonFiltrar = document.querySelector(".filtrar-veterinarios button");
    if (botonFiltrar) {
        botonFiltrar.addEventListener("click", function() {
            actualizarTablaRaza();
        });
    }
// Configurar evento para la tecla Enter en el campo de búsqueda
    const filtroInput = document.getElementById("nameFilter");
    if (filtroInput) {
        filtroInput.addEventListener("input", function(event){
            if(event.key === "Enter"){
                event.preventDefault();
                filtrarRaza();
            }

        })
    }

// También podemos agregar un evento para limpiar el filtro cuando se borre el texto
    if (filtroInput){
        filtroInput.addEventListener("input" , function(event){
            if (this.value === "") {
                filtrarRaza(); // Actualizar sin filtro cuando se borra el texto
            }
        } )
    }

    if (botonEnvioRaza) {
        botonEnvioRaza.addEventListener("click", async function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón

            // Obtenemos los datos de la raza y sus características
            const raza = document.getElementById("nombreRaza").value;
            const caracteristicas = document.getElementById("descripRaza").value;

            // Verificamos que los campos no estén vacíos
            if (raza === "" || caracteristicas === "") {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Empaquetamos los datos en un objeto JSON
            const bodyContent = JSON.stringify({
                "breedName": raza,
                "characteristic": caracteristicas
            });

            // Realizamos la petición al servidor
            try {
                const response = await fetch('http://localhost:8080/api/v1/breed/', {
                    method: "POST",
                    body: bodyContent,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                console.log("Respuesta del servidor (POST raza):", data);

                if (!response.ok) {
                    throw new Error(data.message || "Error al registrar la raza");
                }

                // Limpiar los campos del formulario
                document.getElementById("nombreRaza").value = "";
                document.getElementById("descripRaza").value = "";

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }

                // Actualizar la tabla con los nuevos datos
                actualizarTablaRaza(); // Llamada para recargar la tabla

            } catch (error) {
                console.error("❌ Error al registrar la raza:", error);
            }
        });
    }
})

//Funcion para obtener la lista de razas y sus caracteristicas
function obtenerRazas() {
    return new Promise(async (resolve, reject) => {
        try {
            let url = 'http://localhost:8080/api/v1/breed/';
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
                throw new Error("Error al obtener las razas");
            }

            const data = await response.json();
            console.log("Datos recibidos del servidor:", data); // Verifica los datos aquí
            resolve(data);
        } catch (error) {
            console.error("❌ Error al obtener las razas:", error);
            reject(error);
        }
    });
}

//Funcion para realizar la tabla de razas
function actualizarTablaRaza(){
    obtenerRazas()
    .then(raza => {
        const tbody = document.querySelector(".veterinarios-table tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
        
        if (raza.length === 0) {
            // Mostrar mensaje cuando no hay resultados
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td colspan="3" class="text-center">
                    No se encontraron raza con ese filtro
                </td>
            `;
            tbody.appendChild(tr);
            return;
        }

        //Para cada raza iteramos los datos y los agregamos a la tabla 
        raza.forEach(razas => {
            const tr = document.createElement("tr");
            
            // Verificar que los datos existen antes de mostrarlos
            const id = razas.id || 'N/A';
            const nombre = razas.breedName || 'Sin nombre';
            const caracteristicas = razas.characteristic || 'Sin características';
            
            tr.innerHTML = `
                <td><span class="vet-id">${id}</span></td>
                <td>${nombre}</td>
                <td>${caracteristicas}</td>
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
        console.error("Error al realizar las tablas de raza:", error);
    });
}
actualizarTablaRaza();


//Funcion para eliminar la raza
function eliminarRaza(id) {
    if (confirm("¿Está seguro de que desea eliminar esta raza?")) {
        fetch(`http://localhost:8080/api/v1/breed/${id}`, {
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
                    throw new Error(data.message || "Error al eliminar la raza");
                });
            }

            // Si la eliminación fue exitosa, actualizar la tabla
            console.log("Raza eliminada correctamente");
            actualizarTablaRaza(); // Llamada para recargar la tabla
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar la raza:", error);
            alert("Error al eliminar la raza: " + error.message);
        });
    }    
}

//Funcion para editar la raza
function editarRaza(id) {
        // Obtener los datos actuales de la raza
        fetch(`http://localhost:8080/api/v1/breed/${id}`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "User-Agent": "web",
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la raza");
            }
            return response.json();
        })

        .then(raza => {
            // Crear un modal de edición dinámicamente o usar uno existente
            let modalHtml = `
                <div class="modal fade" id="editarRazaModal" tabindex="-1" aria-labelledby="editarRazaModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editarRazaModalLabel">Editar raza</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="formEditarRaza">
                                    <div class="mb-3">
                                        <label for="editarNombreRaza" class="form-label">Nombre de la raza</label>
                                        <input type="text" class="form-control" id="editarNombreRaza" value="${raza.breedName}" required>
                                        <br>
                                        <input type="text" class="form-control" id="editarCaracteristicasRaza" value="${raza.characteristic}" required>
                                        <input type="hidden" id="razaId" value="${id}">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="guardarEdicionRaza">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            // Eliminar el modal anterior si existe
            const modalAnterior = document.getElementById('editarRazaModal');
            if (modalAnterior) {
                modalAnterior.remove();
            }
    
            // Agregar el nuevo modal al DOM
            document.body.insertAdjacentHTML('beforeend', modalHtml);
    
            // Inicializar el modal de Bootstrap
            const modalElement = document.getElementById('editarRazaModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
    
            // Agregar evento al botón de guardar cambios
            document.getElementById('guardarEdicionRaza').addEventListener('click', function() {
                guardarEdicionRaza(); //
            });
        })
        .catch(error => {
            console.error("Error al cargar datos para edición:", error);
            alert("Error al cargar los datos de la especialidad: " + error.message);
        });
}

function guardarEdicionRaza() {
    const id = document.getElementById('razaId').value;
    const nombreRaza= document.getElementById('editarNombreRaza').value.trim();
    const caracteristicaRaza = document.getElementById('editarCaracteristicasRaza').value.trim();

    if (nombreRaza === "" || caracteristicaRaza === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //empaquetamos los datos en un objeto JSON
    const bodyContent = JSON.stringify({
        "breedName": nombreRaza,
        "characteristic": caracteristicaRaza
    });
    fetch(`http://localhost:8080/api/v1/breed/${id}`, {
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
                throw new Error(data.message || "Error al actualizar el tratamiento");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor (PUT raza):", data);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarRazaModal'));
        if (modal) {
            modal.hide();
        }
        
        // Actualizar la tabla con los nuevos datos
        actualizarTablaRaza();
    })
    .catch(error => {
        console.error("❌ Error al actualizar raza", error);
    });
}



//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarRaza(id);
        });
    });
    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            eliminarRaza(id);
        });
    });
}
