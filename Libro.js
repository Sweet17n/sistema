function mostrarPregunta(id) {
    let preguntaObj = preguntas[id];
    if (!preguntaObj) return;

    document.getElementById("pregunta").innerText = preguntaObj.pregunta;
    document.getElementById("descripcion").innerText = preguntaObj.descripcion || "";
    document.getElementById("lista-recomendaciones").innerHTML = "";
    document.getElementById("boton-reiniciar").style.display = preguntaObj.opciones ? "none" : "block";

    let opcionesDiv = document.getElementById("opciones");
    opcionesDiv.innerHTML = "";

    if (preguntaObj.opciones) {
        for (let opcion in preguntaObj.opciones) {
            let btn = document.createElement("button");
            btn.className = "opcion";
            btn.innerText = opcion;
            btn.onclick = function() { mostrarPregunta(preguntaObj.opciones[opcion]); };
            opcionesDiv.appendChild(btn);
        }
    } else if (preguntaObj.recomendaciones) {
        let lista = document.getElementById("lista-recomendaciones");
        preguntaObj.recomendaciones.forEach(reco => {
            if (reco.edad === "all" || (reco.edad === "13+" && datosUsuario.edad >= 13) || (reco.edad === "18+" && datosUsuario.edad >= 18)) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <img src="${reco.imagen}" alt="${reco.nombre}">
                    <p>${reco.nombre}</p>
                `;
                li.onclick = function() { 
                    mostrarLibro(datosUsuario.idioma === "español" ? reco.libro_es : reco.libro_en, reco.sinopsis); 
                };
                lista.appendChild(li);
            }
        });

        if (lista.innerHTML === "") {
            let li = document.createElement("li");
            li.innerText = "No hay recomendaciones disponibles para tu edad.";
            lista.appendChild(li);
        }
    }
}
function mostrarRecomendaciones(id) {
    let recomendacion = recomendacionesGenero[id];
    if (!recomendacion) return;

    // Crear la sección de recomendaciones
    let seccionRecomendaciones = document.createElement("div");
    seccionRecomendaciones.className = "seccion-recomendaciones";

    // Título de la sección
    let titulo = document.createElement("h2");
    titulo.innerText = "Recomendaciones";
    seccionRecomendaciones.appendChild(titulo);

    // Descripción de la recomendación
    let descripcion = document.createElement("p");
    descripcion.innerHTML = recomendacion.descripcion;
    seccionRecomendaciones.appendChild(descripcion);

    // Botón de pregunta
    let preguntaBtn = document.createElement("button");
    preguntaBtn.innerText = "¿Deseas la recomendación de un libro?";
    preguntaBtn.className = "boton-pregunta";
    seccionRecomendaciones.appendChild(preguntaBtn);

    // Opciones de Sí y No
    let opcionesDiv = document.createElement("div");
    opcionesDiv.className = "opciones-botones";

    let btnSi = document.createElement("button");
    btnSi.innerText = "Sí";
    btnSi.className = "boton-opcion";
    btnSi.onclick = function() {
        mostrarLibrosRecomendados(id);
    };

    let btnNo = document.createElement("button");
    btnNo.innerText = "No";
    btnNo.className = "boton-opcion";
    btnNo.onclick = function() {
        seccionRecomendaciones.innerHTML += "<p class='mensaje-no'>No se mostrará ninguna recomendación.</p>";
    };

    opcionesDiv.appendChild(btnSi);
    opcionesDiv.appendChild(btnNo);
    seccionRecomendaciones.appendChild(opcionesDiv);

    // Botón para elegir otro género
    let botonElegirOtroGenero = document.createElement("button");
    botonElegirOtroGenero.innerText = "Deseas elegir otro género";
    botonElegirOtroGenero.className = "boton-elegir-otro-genero";
    botonElegirOtroGenero.onclick = function() {
        mostrarPreguntaElegirOtroGenero(seccionRecomendaciones);
    };
    seccionRecomendaciones.appendChild(botonElegirOtroGenero);

    // Limpiar y mostrar la sección de recomendaciones
    document.getElementById("lista-recomendaciones").innerHTML = "";
    document.getElementById("lista-recomendaciones").appendChild(seccionRecomendaciones);
}

function mostrarPreguntaElegirOtroGenero(seccionRecomendaciones) {
    // Crear la pregunta y los botones de Sí y No
    let preguntaDiv = document.createElement("div");
    preguntaDiv.className = "pregunta-elegir-otro-genero";

    let preguntaTexto = document.createElement("p");
    preguntaTexto.innerText = "¿Deseas elegir otro género?";
    preguntaTexto.style.fontWeight = "bold";
    preguntaTexto.style.marginBottom = "10px";
    preguntaDiv.appendChild(preguntaTexto);

    let opcionesDiv = document.createElement("div");
    opcionesDiv.className = "opciones-botones";

    let btnSi = document.createElement("button");
    btnSi.innerText = "Sí";
    btnSi.className = "boton-opcion";
    btnSi.onclick = function() {
        mostrarPregunta("inicio");
    };

    let btnNo = document.createElement("button");
    btnNo.innerText = "No";
    btnNo.className = "boton-opcion";
    btnNo.onclick = function() {
        reiniciarRecomendador(); // Devuelve al inicio
    };

    opcionesDiv.appendChild(btnSi);
    opcionesDiv.appendChild(btnNo);
    preguntaDiv.appendChild(opcionesDiv);

    // Agregar la pregunta a la sección de recomendaciones
    seccionRecomendaciones.appendChild(preguntaDiv);
}

function reiniciarRecomendador() {
    document.getElementById("contenedor").style.display = "none";
    document.getElementById("pantalla-inicio").style.display = "flex";
}

function mostrarLibrosRecomendados(id) {
    let recomendacion = recomendacionesGenero[id];
    if (!recomendacion) return;

    let listaRecomendaciones = document.getElementById("lista-recomendaciones");
    listaRecomendaciones.innerHTML = ""; // Limpiar antes de agregar nuevas recomendaciones

    let hayRecomendaciones = false;

    recomendacion.opciones.forEach(opcion => {
        let libro = librosRecomendados[opcion];
        if (libro && datosUsuario.edad >= libro.edad_minima) {
            hayRecomendaciones = true;
            let li = document.createElement("li");
            li.className = "libro-item";
            li.innerText = libro.titulo;
            li.onclick = function() { mostrarLibro(opcion); };
            listaRecomendaciones.appendChild(li);
        }
    });

    // Mostrar mensaje si no hay recomendaciones
    if (!hayRecomendaciones) {
        let mensaje = document.createElement("p");
        mensaje.className = "mensaje-no-recomendaciones";
        mensaje.innerText = "No hay recomendaciones para ti.";
        listaRecomendaciones.appendChild(mensaje);
    }

    // Agregar botón de "Volver al inicio"
    let botonVolverInicio = document.createElement("button");
    botonVolverInicio.innerText = "Volver al inicio";
    botonVolverInicio.className = "boton-elegir-otro-genero";
    botonVolverInicio.onclick = function() {
        reiniciarRecomendador();
    };
    listaRecomendaciones.appendChild(botonVolverInicio);
}