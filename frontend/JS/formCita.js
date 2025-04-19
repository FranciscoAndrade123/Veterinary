document.addEventListener("DOMContentLoaded", function () {

    //Llamamos el boton de enviar el formulario
    const btnEnviar = document.getElementById("botonCita");

    if(btnEnviar){
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

            // 1.Empaquetamos el primer objeto JSON para enviar la entidad Mascota
            const mascotaData = JSON.stringify({
                "petName" : nombreMascota,
                "clientID" : nombreCliente,
                "breedID" : razaMascota,
            })

            //Hacemos la peticion de envio de la entidad mascota 
            try{
                  // Paso 1: Registrar la  entidad mascota
                  const petResponse = await fetch("http://localhost:8080/api/v1/pet/", {
                    method: "POST",
                    body: mascotaData,
                    headers: {
                        "Accept": "*/*",
                        "User-Agent": "web",
                        "Content-Type": "application/json"
                    }
                });

                if (!petResponse.ok) {
                    throw new Error("Error al registrar el veterinario");
                }

                 // Manejar la respuesta como texto si no es JSON
                 const responseText = await petResponse.text();
                 console.log("Respuesta del servidor", responseText);
                  
                // Paso 2: Obtener el ID de la mascota recién creada
                const mascotasResponse = await fetch("http://localhost:8080/api/v1/pet/");
                if (!mascotasResponse.ok) {
                    throw new Error("Error al obtener la lista de mascotas");
                }

                const mascotas = await mascotasResponse.json();
                const mascota = mascotas.find(pet => pet.petName === nombreMascota);

                if (!mascota) {
                    throw new Error("No se encontró el mascota recién creado");
                }

                const mascotaID = mascota.petID; //Ya me esta mostrando el ID de la mascota
                console.log("Mascota registrado con ID:", mascotaID);

                /*******************************************/

                //Empaquetamiento para enviar petición a la entidad cita
                const citaData = JSON.stringify({
                    "appointmentDate" : fecha,
                    "petID" : mascotaID,
                    "veterinarianID" : veterinario,
                    "placeID": sede,
                })

              //Paso 3: Registrar la cita 
              const appointmentResponse = await fetch("http://localhost:8080/api/v1/appointment/", {
                method: "POST",
                body: citaData,
                headers: {
                    "Accept": "*/*",
                    "User-Agent": "web",
                    "Content-Type": "application/json"
                }
             });

             const data = await appointmentResponse.json();
             console.log("Respuesta del servidor (POST cita):", data);

             if (!appointmentResponse.ok) {
                throw new Error("Error al registrar la cita");
            }

            //Paso 4: Obtener el ID de la cita recién creada
            const citasRespuesta = await fetch("http://localhost:8080/api/v1/appointment/");
            if (!citasRespuesta.ok) {
                throw new Error("Error al obtener la lista de las citas");
            }

            const citas = await citasRespuesta.json();
            const cita = citas.find(vet => vet.appointmentDate === fecha);

            if (!cita) {
                throw new Error("No se encontró la  recién creada");
            }

            const citaID = cita.appointmentID;
            console.log("Cita registrada con ID:", citaID);

            //Paso 5 : Registrar la tabla pivote de  appointmentTreatment

            }catch(error){
                console.error(error);
            }
            
        })
    }
})




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


/*****Invocacion de las listas desplegables */
obternerListaRaza();
obternerListaClientes();
obtenerListaSede();
obtenerListaVeterinarios();
obtenerListaTratamientos();