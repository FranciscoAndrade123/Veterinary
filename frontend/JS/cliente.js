const apiUrl = "http://localhost:8080/api/v1/client/"; // URL base de la API



function filtrarCliente() {
    // Esta función solo necesita llamar a actualizarTablaCliente
    // ya que la lógica de filtrado ya está en la función obtenerClientes
    actualizarTablaCliente();

}

document.addEventListener("DOMContentLoaded", function() {
    //Definimos el evento click para el botón de enviar
    const botonCliente = document.getElementById("botonCliente");

       // Agregar evento al botón de búsqueda
       const botonFiltrar = document.querySelector(".filtrar-veterinarios button");
       if (botonFiltrar) {
           botonFiltrar.addEventListener("click", function() {
               actualizarTablaCliente();
           });
       }
   // Configurar evento para la tecla Enter en el campo de búsqueda
       const filtroInput = document.getElementById("nameFilter");
       if (filtroInput) {
           filtroInput.addEventListener("input", function(event){
               if(event.key === "Enter"){
                   event.preventDefault();
                   filtrarCliente();
               }
   
           })
       }
   
   // También podemos agregar un evento para limpiar el filtro cuando se borre el texto
       if (filtroInput){
           filtroInput.addEventListener("input" , function(event){
               if (this.value === "") {
                   filtrarCliente(); // Actualizar sin filtro cuando se borra el texto
               }
           } )
       }

    if (botonCliente) {
        botonCliente.addEventListener("click", async function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón

            // Obtenemos los datos del formulario
            const nombre = document.getElementById("nombreCliente").value.trim();
            const telefono = document.getElementById("teleCliente").value.trim();

            // Validaciones
            if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre) || nombre.length < 3 || nombre.length > 50) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El nombre del cliente debe contener entre 3 y 50 caracteres y no debe contener números.",
                  });
                return;
            }

            if (!telefono || !/^\d{10}$/.test(telefono)) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El teléfono debe contener exactamente 10 dígitos.",
                  });
                return;
            }

            // Empaquetamos los datos en un objeto JSON
            const bodyContent = JSON.stringify({
                "clientName": nombre,
                "phone": telefono
            });

            // Realizamos la petición al servidor
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    body: bodyContent,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                console.log("Respuesta del servidor (POST cliente):", data);

                if (!response.ok) {
                    throw new Error(data.message || "Error al registrar el cliente");
                }

                // Limpiar los campos del formulario
                document.getElementById("nombreCliente").value = "";
                document.getElementById("teleCliente").value = "";

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
                if (modal) {
                    modal.hide();
                }

                // Actualizar la tabla con los nuevos datos
                actualizarTablaCliente();

                //Mostrar modal de éxito de registro
                Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: "El cliente ha sido registrado correctamente.",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                   confirmButtonText: "Aceptar"
                   });

            } catch (error) {
                console.error("❌ Error al registrar el cliente:", error);
            }
        });
    }
})

// Función para obtener los clientes  y mostrarlos en la consola 
function obtenerClientes() {
    return new Promise(async (resolve, reject) => {
        try {
            let url = apiUrl;
            let filtro = document.getElementById("nameFilter").value.toLowerCase();

            if (filtro === "activo" || filtro === "inactivo") {
                url += `filter/status?status=${filtro}`;
            } else if (filtro !== '') {
                url += `filter/${filtro}`;
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
                throw new Error("Error al obtener los clientes");
            }

            const data = await response.json();
            console.log("Datos recibidos del servidor:", data); // Verifica los datos aquí
            resolve(data);
        } catch (error) {
            console.error("❌ Error al obtener los clientes:", error);
            reject(error);
        }
    });
}

//Función que genera las tablas de los clientes con su debida información

function actualizarTablaCliente (){
    obtenerClientes()
    .then(cliente => {
        const tbody = document.querySelector(".veterinarios-table tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
        
        if (cliente.length === 0) {
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
        cliente.forEach(cliente => {
            const tr = document.createElement("tr");
            
            // Verificar que los datos existen antes de mostrarlos
            const id = cliente.id_client || 'N/A';
            const nombreCliente = cliente.clientName || 'Sin nombre';
            const telefonoCliente = cliente.phone || 'Sin teléfono';
            const estado = cliente.status ? 'Activo' : 'Inactivo'; // Verificar el estado y asignar el texto correspondiente
            
            tr.innerHTML = `
                <td><span class="vet-id">${id}</span></td>
                <td>${nombreCliente}</td>
                <td>${telefonoCliente}</td>
                <td>${estado}</td>
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
actualizarTablaCliente() // Llamada inicial para actualizar la tabla al cargar la página


//Función para eliminar el cliente
function eliminarCliente(id){
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
            fetch(`${apiUrl}${id}`, {
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
                    throw new Error(data.message || "Error al eliminar el cliente");
                });
            }

             // Mostrar mensaje de éxito
             Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El cliente ha sido eliminado correctamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });
            actualizarTablaCliente(); // Llamada para recargar la tabla
            return { success: true };
        })
        .catch(error => {
            console.error("Error al eliminar el cliente:", error);
            alert("Error al eliminar el cliente: " + error.message);
        });
    }    
})}

//Función para editar el cliente
function editarCliente(id){
    // Obtener los datos actuales del cliente
    fetch(`${apiUrl}${id}`, {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "User-Agent": "web",
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos del cliente");
        }
        return response.json();
    })
    .then(cliente => {
        // Crear un modal de edición dinámicamente o usar uno existente
        let modalHtml = `
            <div class="modal fade" id="editarClienteModal" tabindex="-1" aria-labelledby="editarClienteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editarClienteModalLabel">Editar cliente</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEditarCliente">
                                <div class="mb-3">
                                    <label for="editarNombreCliente" class="form-label">Nombre del cliente</label>
                                    <input type="text" class="form-control" id="editarNombreCliente" value="${cliente.clientName}" required>
                                    <br>
                                      <label for="editarTelefonoCliente" class="form-label">Teléfono</label>
                                    <input type="number" class="form-control" id="editarTelefono" value="${cliente.phone}" required>
                                    <input type="hidden" id="clientId" value="${cliente.id_client}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="guardarEdicionCliente">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eliminar el modal anterior si existe
        const modalAnterior = document.getElementById('editarClienteModal');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar el nuevo modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById('editarClienteModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Agregar evento al botón de guardar cambios
        document.getElementById('guardarEdicionCliente').addEventListener('click', function() {
            guardarEdicionCliente(); //
        });
    })
}

function guardarEdicionCliente(){
    const id = document.getElementById("clientId").value;
    const nombre = document.getElementById("editarNombreCliente").value;
    const telefono = document.getElementById("editarTelefono").value;

    
    // Validaciones
    if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre) || nombre.length < 3 || nombre.length > 50) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "El nombre del cliente debe contener entre 3 y 50 caracteres y no debe contener números.",
          });
        return;
    }

    if (!telefono || !/^\d{10}$/.test(telefono)) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "El teléfono debe contener exactamente 10 dígitos.",
          });
        return;
    }

      // Empaquetamos los datos en un objeto JSON
      const bodyContent = JSON.stringify({
        "clientName": nombre,
        "phone": telefono
    });

    fetch(`${apiUrl}${id}`, {
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
                throw new Error(data.message || "Error al actualizar el cliente");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor (PUT cliente):", data);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarClienteModal'));
        if (modal) {
            modal.hide();
        }

         //Mostrar modal de éxito de registro
         Swal.fire({
            icon: "success",
            title: "Actualizado exitosamente!",
            text: "El cliente ha sido actualizado correctamente.",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
           confirmButtonText: "Aceptar"
           });
        
        
        // Actualizar la tabla con los nuevos datos
        actualizarTablaCliente();
    })
    .catch(error => {
        console.error("❌ Error al actualizar el cliente", error);
    });
}






//Botones
function agregarEventosBotones() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-edit").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            editarCliente(id);
        });
    });
    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-delete").forEach(button => {
        button.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            eliminarCliente(id);
        });
    });
}


