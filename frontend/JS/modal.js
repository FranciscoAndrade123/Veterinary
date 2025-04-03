// Funciones para manejar las acciones CRUD
function editarCita(idCita) {
    console.log(`Editando cita con ID: ${idCita}`);
    // Aquí iría la lógica para editar la cita
    // Por ejemplo: window.location.href = `/editar-cita.html?id=${idCita}`;
    alert(`Redirigiendo a edición de cita ID: ${idCita}`);
}

function eliminarCita(idCita) {
    console.log(`Eliminando cita con ID: ${idCita}`);
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        // Aquí iría la lógica para eliminar la cita
        // Ejemplo con fetch:
        /* 
        fetch(`/api/citas/${idCita}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Cita eliminada correctamente');
                location.reload();
            } else {
                throw new Error('Error al eliminar la cita');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
        */
        alert(`Cita ID: ${idCita} eliminada (simulación)`);
        // location.reload(); // Recargar para ver los cambios
    }
}