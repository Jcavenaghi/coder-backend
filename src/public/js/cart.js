  // Función para finalizar la compra
  async function finalizarCompra(cartId) {
    // Realiza una solicitud fetch a la ruta "api/carts/:cid/purchase"
    await fetch(`/api/carts/${cartId}/purchase`, {
      method: 'POST', // O el método HTTP que corresponda
      headers: {
        'Content-Type': 'application/json', // Ajusta el tipo de contenido si es necesario
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al finalizar la compra');
        }
        return response.json();
      })
      .then(data => {
        // Maneja la respuesta del servidor después de finalizar la compra
        console.log('Compra finalizada con éxito:', data);
        alert('Compra realizada con éxito');
        window.location.href = "/products"
        // Puedes realizar acciones adicionales aquí, como redireccionar a otra página.
      })
      .catch(error => {
        console.error('Error:', error);
        // Maneja errores aquí, como mostrar un mensaje al usuario.
      });
  }