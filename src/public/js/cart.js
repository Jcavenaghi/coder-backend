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


  document.addEventListener("DOMContentLoaded", function () {

    // Obtiene todos los botones con la clase 'btn-danger'
    const deleteButtons = document.querySelectorAll(".btn-danger");

    // Agrega un evento de clic a cada botón
    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Obtiene el ID del producto del atributo 'data-product-id'
            const productId = this.getAttribute("data-product-id");
            const container = document.querySelector('.container2');
            const cartId = container.getAttribute('data-cartId');
            console.log(productId)
            console.log("-----")
            console.log(cartId)
            // Llama a la función para eliminar el producto del carrito
            deleteProduct(cartId, productId);
        });
    });
});

async function deleteProduct(cartId, productId) {
  const url = `/api/carts/${cartId}/products/${productId}`;
  try {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'DELETE'
        });
        // Maneja el caso de éxito (código de respuesta 2xx)
        if (response.ok) {
            swal({
                icon: 'success',
                title: 'Producto eliminado',
                showConfirmButton: false,
                timer: 1200 // Ajusta el temporizador según sea necesario
            }).then(() => {
              window.location.reload();
            })
        } else {
            // Maneja el caso de error (código de respuesta no 2xx)
            swal({
                icon: 'error',
                title: 'Error al eliminar el producto',
                showConfirmButton: false,
                timer: 1200
            });
            console.error('Error al eliminar el producto:', response.statusText);
        }
      return response
  } catch(error)  {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error(error);
  };
}