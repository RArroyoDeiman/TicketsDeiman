document.addEventListener('DOMContentLoaded', function () {
    const nTRABField = document.getElementById('nTRAB');
    const nombreField = document.getElementById('nombre');
    const userNameField = document.getElementById('userName');
    const passwordField = document.getElementById('password');
    const userImagePreview = document.getElementById('userImagePreview');

    const mainContent = document.getElementById('mainContent');
    //const toggleMenu = document.getElementById('toggleMenu');
    //const sidebar = document.getElementById('sidebar');

    const inicioBtn = document.getElementById('inicioBtn');
    const navbarCenter = document.getElementById('navbarCenter');
    const bitacoraView = document.getElementById('bitacoraView');
    const historialBtn = document.getElementById('historialBtn');

    const usuariosModal = document.getElementById('usuariosModal');
    const usuariosGrid = document.getElementById('usuariosGrid');

    const btnGuardarUsuario = document.getElementById('btnGuardarUsuario');

    function cargarUsuarios() {
        $.ajax({
            url: 'WebService1.asmx/ObtenerTodosUsuarios', // URL del WebService
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',  // Asegúrate de que sea 'json' para manejar la respuesta correctamente
            success: function (data) {
                console.log("Respuesta completa del servidor:", data);  // Verifica lo que se recibe

                // Acceder a la propiedad 'd' que contiene el array de usuarios
                var usuarios = data.d;  // 'd' es la propiedad que contiene el array de usuarios

                // Verificar si 'usuarios' es un array y tiene elementos
                if (Array.isArray(usuarios) && usuarios.length > 0) {
                    console.log("Usuarios obtenidos:", usuarios);  // Verificar los datos de los usuarios
                    mostrarUsuarios(usuarios);  // Llamar a la función que muestra los usuarios en la tabla
                } else {
                    console.log("No se encontraron usuarios.");
                    alert("No se encontraron usuarios.");
                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
                alert("No se pudieron cargar los usuarios.");
            }
        });
    }

    // Cargar los usuarios al abrir el modal
    if (usuariosModal) {
        $(usuariosModal).on('show.bs.modal', function () {
            cargarUsuarios(); // Cargar usuarios al mostrar el modal
        });
    }
    function mostrarUsuarios(usuarios) {
        const tbody = document.querySelector("#usuariosGrid table tbody");
        tbody.innerHTML = "";  // Limpiar cualquier fila previa

        // Iterar sobre el arreglo de usuarios para generar las filas de la tabla
        usuarios.forEach(usuario => {
            const row = document.createElement("tr");

            // Asegurarte de que el idUsuario es la clave correcta y está presente en cada usuario
            row.setAttribute("data-id", usuario.IdUsuario); // Asegúrate de que 'IdUsuario' es el nombre correcto

            // Mostrar los datos de cada usuario en la fila
            const cellNombre = document.createElement("td");
            cellNombre.textContent = usuario.Nombre + " " + usuario.ApellidoPaterno + " " + usuario.ApellidoMaterno;
            row.appendChild(cellNombre);

            const cellNumEmpleado = document.createElement("td");
            cellNumEmpleado.textContent = usuario.NumEmpleado;
            row.appendChild(cellNumEmpleado);

            // Crear celdas para las acciones (editar, eliminar)
            const cellAcciones = document.createElement("td");

            // Botón de editar
            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-warning", "btn-sm");
            btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
            cellAcciones.appendChild(btnEditar);

            // Botón de eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
            btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';

            // Asignar el evento de eliminación
            btnEliminar.addEventListener('click', function () {
                const confirmarEliminacion = confirm("¿Estás seguro de que deseas eliminar este usuario?");
                if (confirmarEliminacion) {
                    // Obtener el idUsuario desde el atributo data-id de la fila
                    const idUsuario = row.getAttribute("data-id"); // Usamos 'data-id'
                    console.log("idUsuario para usuario " + usuario.Nombre + " " + usuario.ApellidoPaterno + ": " + idUsuario); // Verifica el valor

                    if (!idUsuario) {
                        console.error("El idUsuario no está definido para el usuario:", usuario);
                        alert("Error: ID de usuario no válido.");
                        return;
                    }
                    eliminarUsuario(idUsuario);  // Usamos el idUsuario para eliminar
                }
            });

            cellAcciones.appendChild(btnEliminar);

            row.appendChild(cellAcciones);

            // Añadir la fila a la tabla
            tbody.appendChild(row);
        });
    }
    function eliminarUsuario(idUsuario) {
        console.log("Eliminando usuario con ID:", idUsuario);  // Verifica que el idUsuario es correcto
        if (!idUsuario) {
            alert("ID de usuario no válido");
            return;
        }

        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            $.ajax({
                url: 'WebService1.asmx/EliminarUsuario',  // URL del WebService
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({ idUsuario: idUsuario }), // Enviar el idUsuario en el cuerpo
                success: function (response) {
                    console.log('Respuesta del servidor:', response);

                    // Convertir la respuesta de cadena JSON a un objeto
                    var res = JSON.parse(response.d);

                    if (res.success) {
                        alert(res.message);
                        cargarUsuarios();  // Recargar la lista de usuarios después de la eliminación
                    } else {
                        alert(res.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al hacer la solicitud AJAX:', status, error, xhr);
                    alert('Hubo un problema al eliminar el usuario. Por favor, intente nuevamente.');
                }
            });
        }
    }
    // Función para realizar la búsqueda
    function buscarUsuario() {
        const NTRAB = nTRABField.value.trim(); // Obtener el valor de NTRAB

        if (NTRAB.length > 0) {
            console.log("Realizando solicitud para NTRAB: " + NTRAB);

            // eliminar cualquier atributo que pueda bloquear la edición
            passwordField.readOnly = false;
            userNameField.readOnly = false;
            passwordField.disabled = false;
            userNameField.disabled = false;

            // AJAX con jQuery para hacer la solicitud al servidor
            $.ajax({
                url: 'WebService1.asmx/ObtenerUsuarioPorNTRAB', // URL del WebService
                type: 'POST', // Método de la solicitud
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({ NTRAB: NTRAB }), // Datos enviados en el cuerpo de la solicitud
                success: function (data) {
                    console.log("Respuesta completa del servidor:", data);

                    try {
                        if (data && data.d) {
                            data = JSON.parse(data.d);

                            if (data && data.success !== undefined) {
                                if (data.success) { // Si la respuesta tiene 'success' igual a true
                                    const usuario = data.usuario;

                                    if (usuario) {
                                        console.log("Usuario encontrado:", usuario);

                                        // Mostrar los datos del usuario en los campos correspondientes
                                        nombreField.value = usuario.Nombre + " " + usuario.ApellidoPaterno + " " + usuario.ApellidoMaterno;

                                        // Si tiene una foto, mostrarla
                                        if (usuario.Foto && usuario.Foto.length > 0) {
                                            userImagePreview.src = convertirByteArrayAImagen(usuario.Foto);
                                            userImagePreview.style.display = 'block';
                                        } else {
                                            userImagePreview.style.display = 'none'; // Si no tiene foto, ocultarla
                                        }
                                    } else {
                                        console.log("Usuario no encontrado");
                                        alert("Usuario no encontrado");
                                    }
                                } else {
                                    console.log("Respuesta de éxito falsa o error:", data.message || "Sin mensaje");
                                    alert("Error al obtener la información del usuario: " + (data.message || "Desconocido"));
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Error al procesar la respuesta JSON", e);
                        alert("Error al procesar la respuesta del servidor.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener el usuario:', error);
                    alert("Error al intentar obtener el usuario");
                }
            });
        } else {
            alert("Por favor, ingrese un número de trabajador válido.");
        }
    }

    // Asignamos la función de búsqueda tanto al ícono de búsqueda como al botón
    if (btnBuscarUsuarioIcon) {
        btnBuscarUsuarioIcon.addEventListener('click', buscarUsuario);
    }
    // Manejador para el evento de clic en el botón de "Guardar Usuario"
    if (btnGuardarUsuario) {
        btnGuardarUsuario.addEventListener('click', function () {
            const nTRAB = document.getElementById('nTRAB').value.trim();
            const nombre = document.getElementById('nombre').value.trim();
            const userName = document.getElementById('userName').value.trim();
            const password = document.getElementById('password').value.trim();
            const userRole = document.getElementById('userRoleDropdown').value;

            if (nTRAB && nombre && userName && password && userRole) {

                $.ajax({
                    url: 'WebService1.asmx/AgregarUsuario',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify({
                        userName: userName,
                        password: password,
                        nEmp: nTRAB,
                        idTipoUsuario: userRole
                    }),
                    success: function (data) {
                        // Asegúrate de que data está deserializado y se puede verificar 'success'
                        const response = JSON.parse(data.d); // Deserializamos la respuesta del servidor
                        if (response.success) {
                            alert('Usuario guardado con éxito');

                            // Limpiar los campos del formulario
                            document.getElementById('nTRAB').value = '';
                            document.getElementById('nombre').value = '';
                            document.getElementById('userName').value = '';
                            document.getElementById('password').value = '';
                            document.getElementById('userRoleDropdown').value = '';
                            document.getElementById('userImagePreview').src = '../Imagenes/userImage.png';
                        } else {
                            alert('Hubo un error al guardar el usuario: ' + response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error al guardar el usuario:', error);
                        console.error('Respuesta del servidor:', xhr.responseText);
                        alert('Hubo un error al intentar guardar el usuario');
                    }
                });
            } else {
                alert('Por favor, complete todos los campos.');
            }
        });
    }

    // Mostrar u ocultar el menú lateral
    //if (toggleMenu && sidebar && mainContent) {
    //    toggleMenu.addEventListener('click', () => {
    //        sidebar.classList.toggle('hidden');
    //        mainContent.classList.toggle('full-width');
    //        if (window.innerWidth <= 768 && navbarCenter) {
    //            navbarCenter.classList.toggle('mobile-navbar-center');
    //        }
    //    });
    //}

    // Mostrar "Crear Bitácora" cuando se hace clic
    if (document.getElementById('crearBitacora')) {
        document.getElementById('crearBitacora').addEventListener('click', () => {
            sidebar.classList.add('hidden');
            mainContent.classList.add('full-width');
            bitacoraView.style.display = 'block'; // Mostrar la bitácora
            navbarCenter.classList.remove('show-navbar-elements'); // Ocultar los elementos de búsqueda
        });
    }

    // Mostrar los elementos de búsqueda cuando se hace clic en "Historial"
    if (historialBtn) {
        historialBtn.addEventListener('click', () => {
            navbarCenter.classList.add('show-navbar-elements'); // Mostrar los elementos de búsqueda
            bitacoraView.style.display = 'none'; // Ocultar la vista de bitácora
        });
    }

    // Volver a la vista inicial cuando se hace clic en "Inicio"
    if (inicioBtn) {
        inicioBtn.addEventListener('click', () => {
            navbarCenter.classList.remove('show-navbar-elements'); // Ocultar los elementos de búsqueda
            bitacoraView.style.display = 'none'; // Ocultar la vista de bitácora
        });
    }

    // Previsualización de la imagen cuando se selecciona un archivo
    const userImage = document.getElementById('userImage');
    if (userImage) {
        userImage.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const imagePreviewContainer = document.getElementById('imagePreviewContainer');
            const imagePreview = document.getElementById('imagePreview');

            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.style.display = 'block'; // Mostrar la vista previa
                };
                reader.readAsDataURL(file);
            } else {
                imagePreviewContainer.style.display = 'none'; // Si no es una imagen, ocultar la vista previa
            }
        });
    }

    // Función para convertir byte[] a base64
    function convertirByteArrayAImagen(byteArray) {
        if (byteArray && byteArray.length > 0) {
            const base64String = arrayBufferToBase64(byteArray);
            return `data:image/jpeg;base64,${base64String}`;
        }
        return '';
    }

    // Función para convertir ArrayBuffer a base64
    function arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const icon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('expanded');
        icon.classList.toggle('bi-chevron-right');
        icon.classList.toggle('bi-chevron-left');
    });
});