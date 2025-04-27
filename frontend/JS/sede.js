function filtrarSede() {
    // Esta función solo necesita llamar a actualizarTablaSede
    // ya que la lógica de filtrado ya está en la función obtenerSedes
    actualizarTablaSede();

}


document.addEventListener("DOMContentLoaded", function(){
    //Declaramos  el boton para el envío de datos al servidor
    const botonEnvioSede = document.getElementById("botonSede");

    actualizarTablaSede(); // me muestra la lista de sedes

    // Agregar evento al botón de búsqueda
    const botonFiltrar = document.querySelector(".filtrar-veterinarios button");
    if (botonFiltrar) {
        botonFiltrar.addEventListener("click", function() {
            actualizarTablaSede();
        });
    }
// Configurar evento para la tecla Enter en el campo de búsqueda
    const filtroInput = document.getElementById("nameFilter");
    if (filtroInput) {
        filtroInput.addEventListener("input", function(event){
            if(event.key === "Enter"){
                event.preventDefault();
                filtrarSede();
            }

        })
    }

// También podemos agregar un evento para limpiar el filtro cuando se borre el texto
    if (filtroInput){
        filtroInput.addEventListener("input" , function(event){
            if (this.value === "") {
                filtrarSede(); // Actualizar sin filtro cuando se borra el texto
            }
        } )
    }


    if (botonEnvioSede) {
        botonEnvioSede.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del botón

            // Obtenemos los valores de los campos del formulario
            const nombreSede = document.getElementById("nombreSede").value;

            // Imprimimos en consola las variables obtenidas
            console.log("Nombre de la sede: ", nombreSede);

            // Validar que NO contenga números
             const contieneNumeros = /\d/.test(nombreSede);
             if (contieneNumeros) {
            Swal.fire({
                icon: "error",
                title: "Dato inválido",
                text: "El nombre de la sede no debe contener números",
            });
            return;
        }
            if (!nombreSede) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "No pueden estar vacios los campos",
                  });
                return;
            }

            // Realizamos el empaquetamiento del nombre de la sede en un objeto JSON
            const bodyContent = JSON.stringify({
                "placeName": nombreSede
            });

            try {
                const response = await fetch("http://localhost:8080/api/v1/place/", {
                    method: "POST",
                    body: bodyContent,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                console.log("Respuesta del servidor (POST sede):", data);

                if (!response.ok) {
                    throw new Error(data.message || "Error al registrar la sede");
                }

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }

                // Limpiar el campo
                document.getElementById("nombreSede").value = "";

                // Actualizar la tabla con los nuevos datos
                actualizarTablaSede(); // Llamada para recargar la tabla

                //Mostrar modal de éxito de registro
                 Swal.fire({
                 icon: "success",
                 title: "¡Registro exitoso!",
                 text: "La sede ha sido registrada correctamente.",
                 showConfirmButton: true,
                 confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar"
                });

            } catch (error) {
                console.error("❌ Error al registrar la sede", error);
            }
        });
    }
});

// Función  para obtener la lista de sedes

function obtenerSedes(){
    return new Promise (async(resolve, reject) => {
        try{
            let url = 'http://localhost:8080/api/v1/place/';
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
                throw new Error("Error al obtener la lista de sedes");
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

// Función donde se genera las tablas de las sedes
function actualizarTablaSede (){
    //Invocamos la función para obtener la lista de sedes
    obtenerSedes()
        .then(sede => {
            const tbody = document.querySelector(".veterinarios-table tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
           
            //Iterar sobre cada sede y si no hay resultados, mostrar mensaje
            if (sede.length === 0) {
                // Mostrar mensaje cuando no hay resultados
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td colspan="3" class="text-center">
                        No se encontraron sedes con ese filtro
                    </td>
                `;
                tbody.appendChild(tr);
                return;
            }

             // Para cada especialidad, crear una fila en la tabla
             sede.forEach((sede) => {
                const tr = document.createElement("tr");
                 // Verificar que los datos existen antes de mostrarlos
                 const id = sede.id || sede.placeID || 'N/A';
                  const nombre = sede.placeName || 'Sin nombre';                          
                
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

// Función para eliminar una sede
function elimiarSede(id){
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
            fetch(`http://localhost:8080/api/v1/place/${id}`, {
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
                        throw new Error(data.message || "Error al eliminar la sede");
                    });
                }

                // Actualizar la tabla
                actualizarTablaSede();

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'La sede ha sido eliminada exitosamente.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                });
            })
            .catch(error => {
                console.error("Error al eliminar la sede:", error);

                // Mostrar error bonito
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Cerrar'
                });
            });
        }
    });

}


// Función para editar una sede
function editarSede(id){
        // Obtener los datos actuales de la especialidad
        fetch(`http://localhost:8080/api/v1/place/${id}`, {
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

        .then(sede => {
            // Crear un modal de edición dinámicamente o usar uno existente
            let modalHtml = `
                <div class="modal fade" id="editarSedeModal" tabindex="-1" aria-labelledby="editarSedeModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editarSedeModalLabel">Editar sede</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="formEditarSede">
                                    <div class="mb-3">
                                        <label for="editarNombreTratamiento" class="form-label">Nombre de la sede</label>
                                        <input type="text" class="form-control" id="editarNombreSede" value="${sede.placeName}" required>
                                        <input type="hidden" id="sedeId" value="${id}">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="guardarEdicionSede">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            // Eliminar el modal anterior si existe
            const modalAnterior = document.getElementById('editarSedeModal');
            if (modalAnterior) {
                modalAnterior.remove();
            }
    
            // Agregar el nuevo modal al DOM
            document.body.insertAdjacentHTML('beforeend', modalHtml);
    
            // Inicializar el modal de Bootstrap
            const modalElement = document.getElementById('editarSedeModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
    
            // Agregar evento al botón de guardar cambios
            document.getElementById('guardarEdicionSede').addEventListener('click', function() {
                guardarEdicionSede(); // función para guardar cambios
            });
        })
        .catch(error => {
            console.error("Error al cargar datos para edición:", error);
            alert("Error al cargar los datos de la Sed: " + error.message);
        });
}

function guardarEdicionSede() {
    const id = document.getElementById('sedeId').value;
    const nombreSede= document.getElementById('editarNombreSede').value.trim();
            // Validar que NO contenga números
            const contieneNumeros = /\d/.test(nombreSede);
            if (contieneNumeros) {
           Swal.fire({
               icon: "error",
               title: "Dato inválido",
               text: "El nombre de la sede no debe contener números",
           });
           return;
       }
           if (!nombreSede) {
               Swal.fire({
                   icon: "warning",
                   title: "Oops...",
                   text: "No pueden estar vacios los campos",
                 });
               return;
           }
      //empaquetamiento actualizado en formato JSON
      const bodyContent = JSON.stringify({
        "placeName": nombreSede
    });

    fetch(`http://localhost:8080/api/v1/place/${id}`, {
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
        console.log("Respuesta del servidor (PUT sede):", data);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarSedeModal'));
        if (modal) {
            modal.hide();
        }

         //Mostrar modal de éxito de registro
         Swal.fire({
            icon: "success",
            title: "Actualizado exitosamente!",
            text: "La sede ha sido actualizado correctamente.",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
           confirmButtonText: "Aceptar"
           });

        // Actualizar la tabla con los nuevos datos
        actualizarTablaSede();
    })
    .catch(error => {
        console.error("❌ Error al actualizar sede", error);
    });
}






//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarSede(id);
        });
    });
    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            elimiarSede(id);
        });
    });
}




