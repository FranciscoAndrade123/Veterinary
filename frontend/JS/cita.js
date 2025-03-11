// Función para manejar la selección de cartas
function seleccionarCarta(elemento) {
    // Primero, eliminar la clase 'seleccionada' de todas las cartas
    document.querySelectorAll('.carta-agendamiento, .carta-citas ').forEach(carta => {
        carta.classList.remove('seleccionada');
    });
    
    // Luego, agregar la clase 'seleccionada' a la carta que se hizo clic
    elemento.classList.add('seleccionada');
    
    // Activar el botón continuar cuando hay una selección
    document.getElementById('next1').classList.add('activo');
    document.getElementById('next1').disabled = false;
    
    // Almacenar el tipo de selección
    tipoSeleccionado = elemento.classList.contains('carta-agendamiento') ? 'agendar' : 'consultar';
}

// Variable para rastrear el paso actual y el tipo de selección
let pasoActual = 1;
const totalPasos = 5;
let tipoSeleccionado = null;

// Configuración inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar paso 2 inicialmente
    document.querySelectorAll('[id^="paso-2"]').forEach(elemento => {
        elemento.style.display = 'none';
    });
    
    // Desactivar el botón continuar hasta que se haga una selección
    document.getElementById('next1').classList.remove('activo');
    document.getElementById('next1').disabled = true;
    
    // Agregar evento de clic a todas las cartas
    document.querySelectorAll('.carta-agendamiento, .carta-citas , .formulario').forEach(carta => {
        carta.addEventListener('click', function() {
            seleccionarCarta(this);
        });
    });
    
    // Agregar evento al botón continuar
    document.getElementById('next1').addEventListener('click', function() {
        // Si no hay selección, mostrar alerta
        if (!tipoSeleccionado) {
            alert('Por favor selecciona un servicio.');
            return;
        }
         
        /* POSIBLE ERRRORRRRR CUANDO EL USUARIO ELIJA CITAS AGENDADAS 
        //FORMULARIO DE CONTACTO
        // Si seleccionó "consultar citas", redirigir o mostrar mensaje
        if (tipoSeleccionado === 'consultar') {
            window.location.href = '/citasAgendadas.html'; // Redirigir a página de citas
            // Alternativa: mostrar mensaje
            // alert('Redirigiendo a citas agendadas...');
            return;
        }
         */
        
        /* // Validar el formulario en el paso 4 (formulario de contacto)
         if (pasoActual === 4) {
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            
            if (!nombre || !telefono) {
                alert('Por favor completa todos los campos del formulario de contacto.');
                return;
            }
        }
        // Validar el formulario en el paso 5 (formulario de la mascota)
        if (pasoActual === 5) {
            const nombreMascota = document.getElementById('nombre-mascota').value;
            const raza = document.getElementById('raza').value;
            
            if (!nombreMascota || !raza) {
                alert('Por favor completa todos los campos del formulario de la mascota.');
                return;
            }
            // Aquí puedes enviar los datos o mostrar un mensaje de confirmación
            alert('¡Cita agendada con éxito!');
            console.log('Datos del formulario:', { nombreMascota, raza });
            return;
        } */

        // Solo continúa al siguiente paso si seleccionó "agendar"
        if (pasoActual < totalPasos) {
            // Ocultar paso actual
            document.querySelectorAll(`[id^="paso-${pasoActual}"]`).forEach(elemento => {
                elemento.style.display = 'none';
                
                // Animación de salida
                elemento.classList.add('fade-out');
                setTimeout(() => {
                    elemento.style.display = 'none';
                    elemento.classList.remove('fade-out');
                }, 300);
            });
            
            // Mostrar siguiente paso
            pasoActual++;
            document.querySelectorAll(`[id^="paso-${pasoActual}"]`).forEach(elemento => {
                // Animación de entrada
                elemento.classList.add('fade-in');
                elemento.style.display = 'block';
                setTimeout(() => {
                    elemento.classList.remove('fade-in');
                }, 300);
            });
            
            // Actualizar texto del botón si es el último paso
            if (pasoActual === totalPasos) {
                document.getElementById('next1').textContent = 'Finalizar';
            }

            
            
            // Desactivar el botón hasta nueva selección
            document.getElementById('next1').classList.remove('activo');
            document.getElementById('next1').disabled = true;
        } else {
            // Aquí iría el código para finalizar el proceso
            console.log('Proceso finalizado');
            // Redirigir a la página de confirmación o mostrar mensaje
            alert('¡Cita agendada con éxito!');
            // window.location.href = 'confirmacion.html';
        }
    });
});

// Animación cuando se hace hover sobre las cartas
document.querySelectorAll('.carta-agendamiento, .carta-citas').forEach(carta => {
    carta.addEventListener('mouseenter', function() {
        // Animar el ícono
        const icono = this.querySelector('i');
        if (icono) {
            icono.style.transform = 'scale(1.1) rotate(5deg)';
            icono.style.color = '#14B8C0';
        }
    });
    
    carta.addEventListener('mouseleave', function() {
        // Restaurar el ícono
        const icono = this.querySelector('i');
        if (icono) {
            icono.style.transform = 'scale(1) rotate(0deg)';
            icono.style.color = '';
        }
    });
});