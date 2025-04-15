function filtrarTratamiento() {
    // Esta función solo necesita llamar a actualizarTablaTratamientos
    // ya que la lógica de filtrado ya está en obtenerEspecialidades
    actualizarTablaTratamientos();

}


document.addEventListener('DOMContentLoaded' , function(){ 
    //Declaramos el boton para enviar datos al servidor
    const botonEnvio = document.getElementById('botonTratamiento');

     // Cargar las especialidades al iniciar la página
     actualizarTablaTratamientos()
// Agregar evento al botón de búsqueda
     const botonFiltrar = document.querySelector(".filtrar-veterinarios button");
        if (botonFiltrar) {
            botonFiltrar.addEventListener("click", function() {
                actualizarTablaTratamientos();
            });
        }
  // Configurar evento para la tecla Enter en el campo de búsqueda
        const filtroInput = document.getElementById("nameFilter");
        if (filtroInput) {
            filtroInput.addEventListener("input", function(event){
                if(event.key === "Enter"){
                    event.preventDefault();
                    filtrarTratamiento();
                }

            })
        }

    // También podemos agregar un evento para limpiar el filtro cuando se borre el texto
        if (filtroInput){
            filtroInput.addEventListener("input" , function(event){
                if (this.value === "") {
                    filtrarTratamiento(); // Actualizar sin filtro cuando se borra el texto
                }
            } )
        }



    if(botonEnvio){
        botonEnvio.addEventListener('click', async function (event) {
            event.preventDefault;

            //las variables de los datos para el tratamiento
            const treatmentName = document.getElementById("nombreTratamiento").value;
            const treatmentDescription = document.getElementById("descripTratamiento").value 

            console.log("Nombre del tratamiento: " + treatmentName);
            console.log("Descripción del tratamiento: " + treatmentDescription);

            if(!treatmentName || !treatmentDescription){
                alert("Por favor, ingrese los datos solicitados");
                return; 
            }

            //empaquetamiento de los datos en un archivo JSON 
            const bodyContent = JSON.stringify({
                "treatmentName": treatmentName,
                "treatmentDescription": treatmentDescription
            });

            try{
                const response = await fetch('http://localhost:8080/api/v1/treatment/', {
                    method: "POST",
                    body: bodyContent,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    } 
                })

                const data = await response.json();
                console.log("Respuesta del servidor (POST tratamiento):", data);
                
                if (!response.ok) {
                    throw new Error(data.message || "Error al registrar el tratamiento");
                }
                
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Limpiar el campo
                document.getElementById("nombreTratamiento").value = "";
                document.getElementById("descripTratamiento").value = "";

                actualizarTablaTratamientos()

            }catch{
                console.error("❌ Error al registrar el tratamiento", error);
            } 
        })
    }
}); 

//Obtener todos los datos del tratamiento
function obtenerTratamiento(){
    return new Promise( async(resolve,reject)=> {
        try{
            let url = 'http://localhost:8080/api/v1/treatment/';
            let filtro = document.getElementById('nameFilter').value;

            if(filtro != ''){
                url += "filter/" + filtro;
            }
            let headersList = {
                "Accept": "*/*",
                "User-Agent": "web",
                "Content-Type": "application/json"
            }

            let response = await fetch(url,{
                method: 'GET',
                headers: headersList
            });

            if (!response.ok) {
                throw new Error("Error al obtener especialidades");
            }

            const data = await response.json();
            console.log(data)
            resolve(data);

        }catch{
            console.error("Error al obtener los tratamientos:", error);
            reject(error);
        }
    }) 
}

//Función donde se genera las tablas de los tratamientos
function actualizarTablaTratamientos(){
    obtenerTratamiento()
    .then(tratamiento => {
        const tbody = document.querySelector(".veterinarios-table tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
        
        if (tratamiento.length === 0) {
            // Mostrar mensaje cuando no hay resultados
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td colspan="3" class="text-center">
                    No se encontraron tratamientos con ese filtro
                </td>
            `;
            tbody.appendChild(tr);
            return;
        }
        
        // Para cada especialidad, crear una fila en la tabla
        
        tratamiento.forEach(tratamiento => {
            const tr = document.createElement("tr");
            
            // Verificar que los datos existen antes de mostrarlos
            const id = tratamiento.treatmentId !== undefined ? tratamiento.treatmentId : 'N/A';
            const nombre = tratamiento.treatmentName || 'Sin nombre';
            const descripcion = tratamiento.treatmentDescription || 'Sin descripción';
            
            tr.innerHTML = `
                <td><span class="vet-id">${id}</span></td>
                <td>${nombre}</td>
                <td>${descripcion}</td>
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

//Eliminar el registro del tratamiento

//Función de elimiar la tabla en el html de la especialidad 
function eliminarTratamiento(id) {
    if (confirm("¿Está seguro de que desea eliminar este tratamiento?")) {
        fetch(`http://localhost:8080/api/v1/treatment/${id}`, {
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
                    throw new Error(data.message || "Error al eliminar el tratamiento");
                });
            }
            
            // Si la eliminación fue exitosa, actualizar la tabla
            actualizarTablaTratamientos();
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar el tratamiento:", error);
            alert("Error al eliminar el tratamiento: " + error.message);
        });
    }
} 

//Función para editar el tratamiento 
function editarTratamiento(id) {
    // Obtener los datos actuales de la especialidad
    fetch(`http://localhost:8080/api/v1/treatment/${id}`, {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos del tratamiento");
        }
        return response.json();
    })
    .then(tratamiento => {
        // Crear un modal de edición dinámicamente o usar uno existente
        let modalHtml = `
            <div class="modal fade" id="editarTratamientoModal" tabindex="-1" aria-labelledby="editarTratamientoModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editarEspecialidadModalLabel">Editar tratamiento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEditarEspecialidad">
                                <div class="mb-3">
                                    <label for="editarNombreEspecialidad" class="form-label">Nombre del tratamiento</label>
                                    <input type="text" class="form-control" id="editarNombreTratamiento" value="${tratamiento.treatmentName}" required>
                                    <br>
                                    <input type="text" class="form-control" id="editarDescripTratamiento" value="${tratamiento.treatmentDescription}" required>
                                    <input type="hidden" id="tratamientoId" value="${id}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="guardarEdicionTratamiento">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eliminar el modal anterior si existe
        const modalAnterior = document.getElementById('editarTratamientoModal');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar el nuevo modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById('editarTratamientoModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Agregar evento al botón de guardar cambios
        document.getElementById('guardarEdicionTratamiento').addEventListener('click', function() {
            guardarEdicionTratamiento(); //
        });
    })
    .catch(error => {
        console.error("Error al cargar datos para edición:", error);
        alert("Error al cargar los datos de la especialidad: " + error.message);
    });
}

function guardarEdicionTratamiento() {
    const id = document.getElementById('tratamientoId').value;
    const nombreTratamiento= document.getElementById('editarNombreTratamiento').value.trim();
    const descripTratamiento = document.getElementById('editarDescripTratamiento').value.trim();
    
    if (!nombreTratamiento || !descripTratamiento) {
        alert("No pueden estar vacios los campos");
        return;
    }
    //empaquetamiento actualizado en formato JSON
    const bodyContent = JSON.stringify({
        "treatmentName": nombreTratamiento,
        "treatmentDescription": descripTratamiento
    });
    
    fetch(`http://localhost:8080/api/v1/treatment/${id}`, {
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
        console.log("Respuesta del servidor (PUT especialidad):", data);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarTratamientoModal'));
        if (modal) {
            modal.hide();
        }
        
        // Actualizar la tabla con los nuevos datos
        actualizarTablaTratamientos();
    })
    .catch(error => {
        console.error("❌ Error al actualizar especialidad", error);
    });
}



//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarTratamiento(id);
        });
    });
    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            eliminarTratamiento(id);
        });
    });
}

