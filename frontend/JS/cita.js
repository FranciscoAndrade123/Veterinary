// Declarar objeto global para almacenar la selección de cita
let citaData = {};

// Función para manejar la selección de cartas
function seleccionarCarta(elemento) {
    // Eliminar la clase 'seleccionada' de todas las cartas
    document.querySelectorAll('.carta-agendamiento, .carta-citas').forEach(carta => {
        carta.classList.remove('seleccionada');
    });
    
    // Agregar la clase 'seleccionada' a la carta seleccionada
    elemento.classList.add('seleccionada');

    // Almacenar el tipo de selección
    tipoSeleccionado = elemento.classList.contains('carta-agendamiento') ? 'agendar' : 'consultar';
    
    // Si seleccionó "consultar citas", redirigir inmediatamente
    if (tipoSeleccionado === 'consultar') {
        window.location.href = './citasAgendadas.html'; // Cambia esta ruta según tu necesidad
        return; // Importante: salir de la función para no ejecutar el resto del código
    }

    // Si estamos en pasos 1-3, avanzar automáticamente (sin botón)
    if (pasoActual == 1 || pasoActual <= 3) {
        avanzarPaso();
    } else {
        document.getElementById('next1').classList.add('activo');
        document.getElementById('next1').disabled = false;
    }
     // Verificar si el elemento seleccionado es una sede (debe tener `data-id`)
     const sedeID = elemento.getAttribute('data-id');
     if (sedeID) {
         // Almacenar la selección en el objeto global
         citaData.lugar = { id: sedeID };
         console.log(`Sede seleccionada, ID: ${sedeID}`);
     } else {
         console.log("No es una sede, no se asigna ID.");
     }
}

// Variables globales
let pasoActual = 1;
const totalPasos = 5;
let tipoSeleccionado = null;

// Función para avanzar al siguiente paso
function avanzarPaso() {
    // Validar si hay selección en pasos 1-3
    if (pasoActual <= 3 && !tipoSeleccionado) {
        alert('Por favor selecciona una opción.');
        return;
    }

    // Ocultar paso actual con animación
    document.querySelectorAll(`[id^="paso-${pasoActual}"]`).forEach(elemento => {
        elemento.classList.add('fade-out');
        setTimeout(() => {
            elemento.style.display = 'none';
            elemento.classList.remove('fade-out');
        }, 300);
    });

    // Mostrar siguiente paso con animación
    pasoActual++;
    document.querySelectorAll(`[id^="paso-${pasoActual}"]`).forEach(elemento => {
        elemento.style.display = 'block';
        elemento.classList.add('fade-in');
        setTimeout(() => {
            elemento.classList.remove('fade-in');
        }, 300);
    });

    // Ocultar/mostrar el botón según el paso
    const botonContinuar = document.getElementById('next1');
    if (pasoActual >= 4 && pasoActual <= 5) {
        botonContinuar.style.display = 'block'; // Mostrar en pasos 4-5
        botonContinuar.textContent = pasoActual === 5 ? 'Finalizar' : 'Continuar';
        botonContinuar.classList.remove('activo');
        botonContinuar.disabled = true;

        // Si el botón es "Finalizar", aplicar margen superior
    if (pasoActual === 5) {
        botonContinuar.style.marginTop = '0px';
    } else {
        botonContinuar.style.marginTop = '-50px'; // Restaurar si no es "Finalizar"
    }
    } else {
        botonContinuar.style.display = 'none'; // Ocultar en pasos 1-3
    }
}

// Configuración inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar todos los pasos excepto el primero
    for (let i = 2; i <= totalPasos; i++) {
        document.querySelectorAll(`[id^="paso-${i}"]`).forEach(elemento => {
            elemento.style.display = 'none';
        });
    }

    // Ocultar el botón "Continuar" inicialmente (solo visible en pasos 4-5)
    document.getElementById('next1').style.display = 'none';

    // Agregar evento de clic a las cartas (solo en pasos 1-3)
    document.querySelectorAll('.carta-agendamiento, .carta-citas').forEach(carta => {
        carta.addEventListener('click', function() {
            seleccionarCarta(this);
        });
    });

    // Validar campos de formulario en pasos 4-5 y activar el botón
    const camposFormulario = document.querySelectorAll('#paso-4-seleccion-formulario input, #paso-5-seleccion-formulario input');
    camposFormulario.forEach(campo => {
        campo.addEventListener('input', function() {
            const botonContinuar = document.getElementById('next1');
            if (pasoActual >= 4 && pasoActual <= 5) {
                // Verificar si todos los campos requeridos están llenos
                let todosCompletos = true;
                document.querySelectorAll(`#paso-${pasoActual}-seleccion-formulario input[required]`).forEach(c => {
                    if (!c.value) todosCompletos = false;
                });
                
                if (todosCompletos) {
                    botonContinuar.classList.add('activo');
                    botonContinuar.disabled = false;
                } else {
                    botonContinuar.classList.remove('activo');
                    botonContinuar.disabled = true;
                }
            }
        });
    });

    // Animación hover en cartas (solo pasos 1-3)
document.querySelectorAll('.carta-agendamiento, .carta-citas').forEach(carta => {
    carta.addEventListener('mouseenter', function() {
        const icono = this.querySelector('i');
        if (icono) {
            icono.style.transform = 'scale(1.1) rotate(5deg)';
            icono.style.color = '#14B8C0';
        }
    });
    
    carta.addEventListener('mouseleave', function() {
        const icono = this.querySelector('i');
        if (icono) {
            icono.style.transform = 'scale(1) rotate(0deg)';
            icono.style.color = '';
        }
    });
});

   // Evento del botón "Continuar" (solo en pasos 4-5)
document.getElementById('next1').addEventListener('click', async function() {
    const boton = this;
    
    // Validar campos en pasos 4-5 antes de avanzar
    if (pasoActual === 4 || pasoActual === 5) {
        let todosCompletos = true;
        document.querySelectorAll(`#paso-${pasoActual}-seleccion-formulario input[required], #paso-${pasoActual}-seleccion-formulario select[required]`).forEach(campo => {
            if (!campo.value) todosCompletos = false;
        });
        
        if (!todosCompletos) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }
    }
    
    // Desactivar botón durante el procesamiento
    boton.disabled = true;
    boton.innerHTML = 'Procesando...';
    
    try {
        // Si es paso 4 (formulario cliente), enviar datos
        if (pasoActual === 4) {
            await enviarDatos();
        }
        // Si es paso 5 (formulario mascota), enviar datos y finalizar
       else if (pasoActual === 5) {
            await enviarDatosMascota();
           alert('¡Cita agendada con éxito!');
      // Aquí podrías redirigir o reiniciar el formulario
           return;
       }
      // Avanzar al siguiente paso si todo fue exitoso
        avanzarPaso();
    } catch (error) {
        console.error("Error:", error);
        alert(error.message || 'Hubo un error al procesar la información');
    } finally {
        // Restaurar botón
        boton.disabled = false;
        boton.innerHTML = pasoActual === 5 ? 'Finalizar' : 'Continuar';
    }
});

//Variable global para los ID
let clienteID = null; // Se usará en todos los pasos


//peticiones para enviar datos del cliente al servidor  (Funciona)
async function enviarDatos() {
    if (pasoActual !== 4 && pasoActual !== 5) return true;

    const nombreCliente = document.getElementById("nombre").value;
    const telefonoCliente = document.getElementById("telefono").value;

    const headersList = {
        "Accept": "*/*",
        "User-Agent": "web",
        "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
        "clientName": nombreCliente,
        "phone": telefonoCliente
    });

    try {
        const response = await fetch("http://localhost:8080/api/v1/client/", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar cliente');
        }

        console.log("Respuesta del servidor:", data);
        clienteID = data.clientID; // <-- Aquí guardamos el ID globalmente
        return data;

    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
          
}
})

async function enviarDatosMascota() {
    // Solo aplica a los pasos 4 y 5 (formularios)
    if (pasoActual !== 4 && pasoActual !== 5) return true;
    
    // Obtengo el nombre de la mascota
    const nombreMascota = document.getElementById("nombreMascota").value;
    // Agrega aquí otros campos de la mascota que necesites
    
    // Configurar headers
    const headersList = {
        "Accept": "*/*",
        "User-Agent": "web",
        "Content-Type": "application/json"
    };
    
    // Este es el punto clave - incluir el ID del cliente en los datos de la mascota
    const bodyContent = JSON.stringify({
        "petName": nombreMascota,
      //"breedID": breedID,
        "clientID": clienteID  // Usamos el ID global guardado anteriormente
    });
    
    try {
        const response = await fetch("http://localhost:8080/api/v1/pet/", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar mascota');
        }
        
        console.log("Mascota registrada:", data);
        return data;
    } catch (error) {
        console.error("Error al registrar mascota:", error);
        throw error;
    }
}

//La obtencion de los datos de los nombre del veterinario
async function obtenerVeterinarios() {
    try {
        const response = await fetch("http://localhost:8080/api/v1/veterinarian/");
        if (!response.ok) throw new Error("Error al obtener los veterinarios");
        const data = await response.json();
        llenarSelect("opciones-veterinario", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

function llenarSelect(idSelect, veterinarios) {
    const select = document.getElementById(idSelect);
    // Clear existing options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un veterinario";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
    
    veterinarios.forEach(vet => {
        const option = document.createElement("option");
        option.value = vet._veterinarianID; 
        option.textContent = vet._veterinarianName; 
        select.appendChild(option);
    });
}


// La obtención de los datos del nombre del tratamiento
async function obtenerTratamiento() {
    try {
        const response = await fetch("http://localhost:8080/api/v1/treatment/");
        if (!response.ok) throw new Error("Error al obtener los tratamientos");
        const data = await response.json();
        llenarSelectTratamientos("opciones-tratamiento", data); 
    } catch (error) {
        console.error("Error:", error);
    }
}

function llenarSelectTratamientos(idSelect, tratamientos) {
    const select = document.getElementById(idSelect);
    // Clear existing options
    select.innerHTML = '';

    // Agregar opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un tratamiento";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    tratamientos.forEach(trat => {
        const option = document.createElement("option");
        option.value = trat.treatmentId; 
        option.textContent = trat.treatmentName; 
        select.appendChild(option);
    });
}

// La obtención de los datos del nombre de la raza

async function obtenerRaza() {
    try{
        const response = await fetch("http://localhost:8080/api/v1/breed/");
        if (!response.ok) throw new Error("Error al obtener el nombre de la raza");
        const data = await response.json();
        llenarSelectRaza("opciones-raza", data); 
    }catch (error){
        console.error("Error:", error);
    }
}

function llenarSelectRaza(idSelect, raza) {
    const select = document.getElementById(idSelect);
    // Clear existing options
    select.innerHTML = '';

    // Agregar opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una raza";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

    raza.forEach(raz => {
        const option = document.createElement("option");
        option.value = raz.breedID; 
        option.textContent = raz.breedName; 
        select.appendChild(option);
    });
}


// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    obtenerVeterinarios();
    obtenerTratamiento(); 
    obtenerRaza();
});

