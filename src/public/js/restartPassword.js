const form = document.getElementById('restartPasswordForm');

form.addEventListener('submit', e=>{
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);

    fetch('/api/session/restartPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result=>{
        // Verificar si el registro fue exitoso
        if (result.status === "success") {
        // Registro exitoso, mostrar alerta y redirigir
        swal({
            title: "Contraseña restaurada",
            icon: "success"
          }).then(() => {
            window.location.href = '/login';
          })
        }
    })

})