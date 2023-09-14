function modificarUsuario(userId) {
    console.log( `estoy: ${userId}` )
    fetch(`/api/users/premium/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // Actualización exitosa, puedes realizar alguna acción adicional aquí
          console.log('Rol de usuario actualizado correctamente.');
          window.location.reload();
        } else {
          // Manejar errores aquí, por ejemplo, mostrar un mensaje de error al usuario
          console.error('Error al actualizar el rol del usuario:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
      });
}

function eliminarUsuario(userId) {
    console.log("HOLA ESTOY!: " + userId)
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('Usuario eliminado correctamente.');
          window.location.reload();
    
        } else {
          console.error('Error al eliminar el usuario:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
      });
  }