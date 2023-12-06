const form = document.getElementById('registerForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/session/register',{
        method:'POST',
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
            title: "Registro exitoso",
            text: "Usuario registrado exitosamente!",
            icon: "success"
          }).then(() => {
            window.location.href = '/login';
          })
        } else {
            // Registro fallido, mostrar alerta de error
            swal({
                title: "No se registro el usuario",
                text: "No fue posible realizar el registro, intente nuevamente",
                icon: "error"
              }).then(() => {
                window.location.href = '/register';
              })
        }
        return result;
    })
})