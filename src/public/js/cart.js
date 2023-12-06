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
          swal({
            title: "Compra fallida",
            text: "No pudo realizarse la compra.",
            icon: "error"
          }).then(() => {
            throw new Error('Error al finalizar la compra');
          })
        }
        return response.json();
      })
      .then(data => {
        // Maneja la respuesta del servidor después de finalizar la compra
        swal({
          title: "Compra exitosa",
          text: "¡Se realizo la compra de los productos solicitados!",
          icon: "success"
        }).then(() => {
          window.location.href = "/products"
        })
      })
      .catch(error => {
        console.error('Error:', error);
        // Maneja errores aquí, como mostrar un mensaje al usuario.
        swal({
          title: "Ocurrio un error al procesar la compra",
          icon: "error"
        })
      });
  }