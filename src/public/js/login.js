const form = document.getElementById("loginForm");

form.addEventListener('submit', e =>{
    e.preventDefault();

    const data = new FormData(form);

    const obj = {};

    data.forEach((value,key) => obj[key]=value)

    fetch('/api/session/login',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })    
    .then(response => response.json())
    .then(result=>{
        // Verificar si el registro fue exitoso
        if (result.status === "success") {
        // Registro exitoso, mostrar alerta y redirigir
        swal({
            title: "Logueo exitoso!",
            icon: "success"
          }).then(() => {
            window.location.href = '/profile';
          })
        } else {
            // Registro fallido, mostrar alerta de error
            swal({
                title: "Logueo fallido",
                text: "usuario y/o contraseña incorrecto/s",
                icon: "error"
              }).then(() => {
                window.location.href = '/login';
              })
        }
        return result;
    })
})

window.addEventListener('load', function () {
    var myModal = new bootstrap.Modal(document.getElementById('loginModal'));
    myModal.show();
});
