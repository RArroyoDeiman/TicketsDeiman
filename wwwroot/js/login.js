document.getElementById('loginButton').addEventListener('click', function () {
    // Activar la animación del logo
    document.getElementById('logoCircle').classList.add('logo-anim');

    // Después de 1 segundo (el tiempo de la animación), redirigir al dashboard
    setTimeout(function () {
        window.location.href = '../main/dashboard.html'; // Redirigir al dashboard
    }, 1000); // Tiempo de duración de la animación
});